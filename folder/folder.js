//각 홈페이지를 만들어야 하나?
// https://stackoverrun.com/ko/q/3898207 과목명 불러올 때 참고하기
function newPostIt(index){
    //파일, 내용 , 링크 저장하는 팝업창
    var popupWidth = 400;
    var popupHeight = 300;
    var popupX = (document.body.offsetWidth/2) - (popupWidth/2);
    var popupY = (document.body.offsetHeight/2) - (popupHeight/2);
    var url = "pluspostit.html?index="+index; 
    var name = "plus postIt"
    var option = "width ="+popupWidth+", height ="+popupHeight+", left="+popupX+", top="+popupY+", scrollbars = yes, location = no";
    window.open(url, name, option);
}
function PostItLink(goto){
    if(goto=='pid'){
        // var link=window.open();
        // link.location="http://www.profibus.co.kr/data/Pid.pdf";
     

    }
    else if(goto=='shell'){
        // var link=window.open();
        // link.location="https://jhnyang.tistory.com/57";
    }
    else if(goto=='scheduler'){
        // var link=window.open();
        // link.location="https://k39335.tistory.com/32";
    }
}
function PostItContent(title){
    var popupWidth = 400;
    var popupHeight = 300;
    var popupX = (document.body.offsetWidth/2) - (popupWidth/2);
    var popupY = (document.body.offsetHeight/2) - (popupHeight/2);
    //var url = "pluspostit.html"; 
    //var name = "plus postIt"
    var option = "width ="+popupWidth+", height ="+popupHeight+", left="+popupX+", top="+popupY+", scrollbars = yes, location = no";
    window.open(url, name, option);
}
function PostItFile(){
    alert("저장된 파일로 접근합니다.");
}
function plusTodo(){
    var username = localStorage.getItem('username');
    var user = getActiveUser(username);
    var title = localStorage.getItem('folder'); //현재 클릭한 폴더 이름 가져오기
    var folderlist = user.folder;
    var folder;
    for (var i=0; i<folderlist.length; i++) {
        if (folderlist[i].title == title) { //사용자가 클릭한 폴더 정보 받아오기
            folder = folderlist[i];
            break;
        }
    }

    var new_label=document.createElement('label');
    var wrap=document.getElementById('Todolist')
    var new_text=window.prompt("할 일 목록을 채우세요","");
    var new_checkbox=document.createElement('input');
    var new_p=document.createElement('label');

    new_p.innerHTML=new_text;


    new_checkbox.setAttribute('type','checkbox');
    new_checkbox.setAttribute('id','new_checkbox');

    new_checkbox.addEventListener("click", function() {
        var parent = this.parentElement;
        //클릭하면 false로 변경되도록
        if (this.checked) { //체크된 경우
            //사용자 정보에서 false로 바꾸기//
            //console.log('체크됨2'+parent.childNodes[1].innerHTML);
            var todo = parent.childNodes[1].innerHTML; //할일 이름 저장
            var todolist = folder.todo;
            for (var i=0; i<todolist.length; i++) {
                if (todolist[i].content == todo) { //파라미터와 일치하는 투두 가져오기
                    //삭제하기
                    //todolist.splice(i,1);
                    //아니면 값만 바꾸기
                    todolist[i].isfinished = true;
                    break;
                }
            }
        }
        console.log('변경사항 확인');
        console.info(folder.todo);
    });
    new_label.appendChild(new_checkbox);
    new_label.appendChild(new_p);

    wrap.appendChild(new_label);
    //사용자 정보에 할일 추가
    var newtodo = {
        content : new_text,
        isfinished : false
    }
    folder.todo.push(newtodo);
    console.log('할일 추가 확인');
    console.info(folder.todo);
    
    new_label.className="new_folder_todo";
            //완성 ㅎㅎ
}
function btnHome(){
    location.replace("../mainframe.html");
}
function logout(){
    location.replace("../login/login.html")
}
function onEditClicked(order){
    var edit_content=prompt("바꿀 포스트잇 이름을 입력하세요","");

    var edit_div=document.getElementsByClassName('post');
    edit_div[order].innerHTML=edit_content
   //수정 완료 ^^

}
function onDeleteClicked(order){
    var delete_btn=document.getElementsByClassName("deleteFolder"); //여러 개의 div들
   // delete_btn.item(order)

    var wrap=document.getElementById("wrap_postit"); //포스트잇을 감싸는 div

    wrap.removeChild(delete_btn.item(order).parentElement);
    //삭제 완료^^
}
function gotoUrl(order,folder_order){
    var username=localStorage.getItem("username");
    activeUser=getActiveUser(username);
    //순서에 맞게 들어온 애들을 보여주기.
    //해당 그걸로 이동하게
    var goto=activeUser.folder[folder_order].postIt[order].url;
    
    if(activeUser.folder[folder_order].postIt[order].type=="link"){
        var link=window.open();
        link.location=goto}
    else if(activeUser.folder[folder_order].postIt[order].type=="content"){
        alert(goto);

        // var file=goto
        // var rawFile=new XMLHttpRequest();
        // rawFile.open("GET",file,false);
        // rawFile.onreadystatechange=function(){
        //     if(rawFile.readyState===4){
        //         if(rawFile.status===200 || rawFile.status==0){
        //             var allText=rawFile.responseText;
        //             alert(allText);
        //         }
        //     }
        // }
        // //rawFile.send(null); //에러나는데 해결 방법은 jqeury랑 php사용임..
    }
    else {
        alert("파일의 위치는 "+goto+" 입니다");
    }
}

function getTodoList() {
    var username = localStorage.getItem('username');
    var user = getActiveUser(username);
    var folderlist = user.folder;
    var folder;
    for (var i=0; i<folderlist.length; i++) {
        if (folderlist[i].title == curfolder) { //사용자가 클릭한 폴더 정보 받아오기
            folder = folderlist[i];
            break;
        }
    }
    //todo list에 있는 데이터 뿌려주기
    var todolist = folder.todo;

    for (var i=0; i<todolist.length; i++) {
        if (!todolist[i].isfinished) { //만료되지 않은 경우 뿌림
            var new_label=document.createElement('label');
            var wrap=document.getElementById('Todolist')
            var new_checkbox=document.createElement('input');
            var new_p=document.createElement('label');      
            new_p.innerHTML = todolist[i].content;
            new_checkbox.setAttribute('type','checkbox');
            new_checkbox.setAttribute('id','new_checkbox');
            new_label.appendChild(new_checkbox);
            new_label.appendChild(new_p);
            wrap.appendChild(new_label);

            new_label.className="new_folder_todo";
            new_checkbox.addEventListener("click", function() {
                var parent = this.parentElement;
                //클릭하면 false로 변경되도록
                if (this.checked) { //체크된 경우
                    //사용자 정보에서 false로 바꾸기//
                    //console.log('체크됨2'+parent.childNodes[1].innerHTML);
                    var todo = parent.childNodes[1].innerHTML; //할일 이름 저장
                    var todolist = folder.todo;
                    for (var i=0; i<todolist.length; i++) {
                        if (todolist[i].content == todo) { //파라미터와 일치하는 투두 가져오기
                            //삭제하기
                            //todolist.splice(i,1);
                            //아니면 값만 바꾸기
                            todolist[i].isfinished = true;
                            break;
                        }
                    }
                }
                console.log('변경사항 확인');
                console.info(folder.todo);
            });
        } else { //만료 되었으므로 삭제
            //눈에 보이지 않게
            //in here
            todolist.splice(i, 1); //데이터에서 삭제
        }
    }
    console.log('현재 폴더의 할 일 목록 확인');
    console.info(todolist);
}


function getTodo(content) { //할일목록 이름으로 가져오기
    var username = localStorage.getItem('username');
    var user = getActiveUser(username);
    var folderlist = user.folder;
    var title = localStorage.getItem('folder'); //현재 폴더이름 가져오기
    var folder;
    for (var i=0; i<folderlist.length; i++) {
        if (folderlist[i].title == title) { //사용자가 클릭한 폴더 정보 받아오기
            folder = folderlist[i];
            break;
        }
    }
    var todolist = folder.todo;
    for (var i=0; i<todolist.length; i++) {
        if (todolist[i].content == content) { //파라미터와 일치하는 투두 가져오기
            return todolist[i];
        }
    }
}