const mongoose=require('mongoose'); //model의 구성요소에서 필요한것
const {Schema} = mongoose;

const day_schema=new Schema({
    user_id : { // 과목 주인의 _id (이메일 아님, 몽고DB 자체 _id)
        type : Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }, 
    dday_content:{type:String, unique:true, required:true},
    final_date:{type:Date, required:true}, //선택한 날짜
    start_date:{type:Date, required:true} //오늘 날짜
});

module.exports = mongoose.model('D_Day',day_schema); 