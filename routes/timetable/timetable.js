const express = require('express');
const { isLoggedIn, isNotLoggedIn} = require('../middlewares');
const Course = require('../../models/course');
const CourseSchedule = require('../../models/course_schedule');
const router = express.Router();

var timeList = new Array();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});


function courseDay(day) {
    switch(day) {
        case '1':
            return "월요일";
        case '2':
            return "화요일";
        case '3':
            return "수요일";
        case '4':
            return "목요일";
        case '5':
            return "금요일";
        case '6':
            return "토요일";
    }
}

function courseType(type) { //과목 타입(online_realtime,online_video,offline)
    switch (type) {
        case 'online_realtime':
            return '온라인 실시간';
        case 'online_video':
            return '온라인 동영상';
        case 'offline': //오프라인이면 강의실을 리턴
            return '오프라인';
    }
}

function getCurrentDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}

router.get('/main', isLoggedIn, async (req, res, next) => {

    try {
        //console.log('현재 로그인:'+res.locals.user.email);
        const timetable = await Course.find( {user_id: res.locals.user._id}).populate('schedules').sort({'createdAt':1});
        // console.log('---------------------로그인된사람의시간표---------------------');
        // console.info(timetable);
        res.render( '../views/timetable/timetable_main.ejs', {
            title: '내 시간표',
            user : res.locals.user,
            timetable : timetable
        });

        

    }
    catch (err) {
        console.error('/views/timetable/timetable.js 에서 에러');
        console.error(err);
        next(err);
    }
});


router.get('/edit', isLoggedIn, async (req, res, next) => {

    try {
        const timetable = await Course.find({user_id: res.locals.user._id}).populate('schedules').sort({'createdAt':1});
        //console.info(timetable);
        res.render('../views/timetable/timetable_edit.ejs', {
            title: '시간표 관리',
            user : res.locals.user,
            timetable : timetable
        });
    }
    catch (err) {
        console.error('/views/timetable/timetable.js 에서 에러');
        console.error(err);
        next(err);
    }
});


router.post('/course/time/add', isLoggedIn, async (req, res, next) => {
    //console.log(req.body);
    const { type, day, stime, etime, classroom, target } = req.body;
    try {
        var time = {
            type : type,
            day : day, //mon, tue, ... 저장 -> 1, 2, 3 ... 저장
            stime : stime, //시작시간
            etime : etime, //종료시간
            classroom : classroom, // 링크or강의실
            target : target // 삭제할 애의 num
        }
        // 시간 중복 확인 in DB
        const checkCourse = await Course.find({user_id: res.locals.user._id}).populate('schedules');
        if (checkCourse != null) {
            for (var i = 0; i < checkCourse.length; i++) {
                var course = checkCourse[i];
                for (var j=0; j<course.schedules.length; j++) {
                    var schedule = course.schedules[j];
                    if ((schedule.day === day) && (stime <= schedule.start_time && schedule.start_time <= etime)) {
                        return res.send( {message : '/course/time/add?error=exist', course : course.course_name });
                    }
                    
                }
            }
        }
        // 시간 중복 확인 in timeList
        if (timeList.length > 0) {
            for(var i = 0; i < timeList.length; i++) {
                if ((timeList[i].day === day) && (stime <= timeList[i].stime && timeList[i].stime <= etime)) {
                    return res.send( {message : '/course/time/add?error=exist', course : 'this' });
                }
            }
        }
        

        timeList.push(time); // 시간 추가

        var returnTime = {
            type : courseType(type),
            day : courseDay(day),
            stime :stime,
            etime:etime,
        }
        res.send(returnTime); // 추가된 시간 출력용으로 전달
    } catch(err) {
        return (err);
    }
});


router.delete('/course/time/delete', isLoggedIn, async (req, res) => {
    console.log(req.body);
    var targetNum = req.body.target;
    try {
        const index = timeList.findIndex(function(item) {
            return item.target === targetNum
        });
        
        timeList.splice(index, 1); // index번째의 시간 1개 삭제
        var data = {
            index : targetNum
        }
        res.send(data); //삭제될 태그들의 id 리턴
        
    } catch(err) {
        return (err);
    }
});



router.post('/course/add', isLoggedIn, async (req, res, next) => {
    console.log(req.body);
    const {name, professor} = req.body;

    try {
        // 과목 이름 중복 확인 => 필요없음 (이름이 중복될 수도 있으니까..)
        // const check = await Course.findOne({user_id:req.user._id, course_name:name});
        // if (check != null) {
        //     console.log('이미 추가한 과목입니다.');
        //     // return res.redirect('/course/add?error=exist');
        //     return res.send('/course/add?error=exist');
        // }

        //timeList (과목 스케줄) 정렬
        timeList.sort(function (a,b) { // 시작 시간순 정렬
            return parseFloat(a.stime) - parseFloat(b.stime);
        });
        timeList.sort(function (a,b) { // 요일순 정렬
            return parseFloat(a.day) - parseFloat(b.day);
        });


        // mongoDB에 과목 시간 추가
        var courseIdList = new Array();
        for (var i=0; i < timeList.length; i++) {
            var courseSchedule = await CourseSchedule.create({
                day : timeList[i].day,
                start_time : timeList[i].stime,
                end_time : timeList[i].etime,
                course_type : timeList[i].type,
                classroom : timeList[i].classroom
            });
            courseIdList.push(courseSchedule._id); // course_id 넣기 (과목 1개의 mongodb id값)
        }

        console.log('user:'+req.user._id);

        // mongoDB에 과목 추가
        const course = await Course.create({ 
            user_id : req.user._id, // 해당 과목의 사용자 obj_id (email 아님! mongodb id값임!)
            course_name : name,
            professor_name : professor,
            schedules : courseIdList, // 과목 시간 리스트
            createdAt : getCurrentDate(), // 과목 추가 날짜
        });
        

        // user한테도 courses 칼럼에 과목 넣어주기 (이건 불러올때 populate 하면됨)
        res.send( {
            _id : course._id,
            user_id : req.user._id, // 해당 과목의 사용자 obj_id (email 아님! mongodb id값임!)
            course_name : name,
            professor_name : professor,
            schedules : timeList, // 과목 시간 리스트
            createdAt : getCurrentDate(), // 과목 추가 날짜
        }); // 추가한 과목 정보 리턴
        timeList = []; // 저장 완료 후 배열 초기화

    } catch (err) {
        next(err);
    }
});

router.delete('/course/delete:id', isLoggedIn, async (req, res, next) => {
    try {
        const deleteId = req.params.id;
        await Course.deleteOne({user_id: res.locals.user._id, _id:deleteId});
        return res.send('delete_succeeded'); //삭제한 과목 리턴
    }
    catch (err) {
        next(err);
    }
});

router.put('/course/modify', isLoggedIn, async (req, res, next) => {
    try {
        const {name, professor, id} = req.body;
        
        var courseIdList = new Array();
        for (var i=0; i < timeList.length; i++) {
            var courseSchedule = await CourseSchedule.create({
                day : timeList[i].day,
                start_time : timeList[i].stime,
                end_time : timeList[i].etime,
                course_type : timeList[i].type,
                classroom : timeList[i].classroom
            });
            courseIdList.push(courseSchedule._id); // course_id 넣기 (과목 1개의 mongodb id값)
        }

        // mongoDB에 과목 수정
        await Course.updateOne({ user_id: res.locals.user._id, _id: id }, { 
            user_id : req.user._id, // 해당 과목의 사용자 obj_id (email 아님! mongodb id값임!)
            course_name : name,
            professor_name : professor,
            schedules : courseIdList, // 과목 시간 리스트
            createdAt : getCurrentDate(), // 과목 수정 날짜
        });
        timeList = []; // 저장 완료 후 배열 초기화

        // // 수정된 timetable 렌더링 위해서 가져오기
        // const timetable = await Course.find({user_id: res.locals.user._id}).populate('user_id').populate('schedules').sort({'createdAt':-1});
        // res.render('../views/timetable/timetable_edit.ejs', {
        //     title: '내 시간표',
        //     user : res.locals.user,
        //     timetable : timetable
        // });
        res.send('success');
        
    } catch (err) {
        next(err);
    }
});

module.exports = router;