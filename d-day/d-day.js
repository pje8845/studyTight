function selectdate(){
    var day=prompt("끝낼 날을 입력하세요","YYYY-MM-DD");

    var today=new Date();
    var futureDate=new Date(day);

    var gap=futureDate.getTime()-today.getTime();
    gap=Math.floor(gap/(1000*60*60*24))+1;

    var dday=document.getElementById("d-date");
    dday.setAttribute('value',"D-"+gap)

    return gap
}
function sayPrompt(){
    alert("등록 버튼을 통해서 날짜와 내용을 입력하세요")
}

function selectContent(){
        content=prompt("D-day 내용을 입력하세요","ex)웹 공부하기");
        dContent=document.getElementById("d-content")
        dContent.setAttribute('value',content)
    return content
    }      
function storeDday(){
//    var Dday=document.getElementById('.d-date');
//    var Dcontent = document.getElementById('.d-content');

//    var day=Dday.getAttribute(value);
//    var content=Dcontent.getAttribute(value);

    localStorage.setItem('d-date',selectdate());
    localStorage.setItem('d-content',selectContent());

    //저장완료. 근데 등록버튼을 먼저 눌러야 실행된다.

    return plusDday(localStorage.getItem('d-date'),localStorage.getItem('d-content'));

}
function plusDday(new_date, new_content){
    var d_table=document.getElementById('table_body');

    var new_tr=document.createElement('tr');
    new_tr.setAttribute('class','new_tr');
    new_tr.setAttribute('id','new_tr')

    var td1=document.createElement('td');
    var td2=document.createElement('td');
    var td3=document.createElement('td');
    var td4=document.createElement('td');

    td1.innerText="D-"+new_date;
    td2.innerText=new_content;
    td2.setAttribute('id','pluscontent')
    td3.setAttribute('class','new_modify_btn');
    td3.setAttribute('id','new_modify_btn');
    td3.setAttribute('onclick','new_modify();')
    td4.setAttribute('class','new_delete_btn');
    td4.setAttribute('id','new_delete_btn')
    td4.setAttribute('onclick','new_delete();')

    
    new_tr.appendChild(td1);
    new_tr.appendChild(td2);
    new_tr.appendChild(td3);
    new_tr.appendChild(td4);

    d_table.appendChild(new_tr);
}

function modifyDday(order){
    var content_modify=document.getElementsByClassName('content');
    var modi_content=prompt("수정할 내용을 입력하세요");
 
    content_modify.item(order).innerHTML=modi_content;
    
    //수정완료 ^^

}
function deleteDday(order){
    var content_delete=document.getElementsByClassName('btn_delete_d-day');
    var parent=document.getElementById('table_body');

    // var content=document.getElementsByClassName("content") //여러개가 있다
    // var username = localStorage.getItem('username'); 
    // activeUser = getActiveUser(username);  
    // var day_list = activeUser.d_day; //안에 6개 있다
    // for (var i=0; i<day_list.length; i++) {
    //     if (day_list[i].content == content.item(order)) { //해당 데이터 삭제
    //         localStorage.removeItem(day_list[i]) //i번째 인덱스를 하나 삭제
    //         console.log("삭제된 D-day는 "+day_list[i].content)
    // }
    //}
    //local에서 삭제되는 건 하는 중 ㅜ ㅜ 
        parent.removeChild(content_delete.item(order).parentElement.parentElement);
        //삭제 완료 ^^
        }
function new_modify(){
    var btn=document.getElementById("pluscontent");

    var new_mod=prompt("수정할 내용을 입력하세요");
    btn.innerHTML=new_mod;
    //수정 완료^^
    
}
function new_delete(){
    var btn=document.getElementById("new_delete_btn")
    var parent=document.getElementById('table_body')
   parent.removeChild(btn.parentElement)
   //삭제 완료 ^^
}
//user의 정보들 가져오기 완료
//가져와서 삭제, 추가 가능함.

function showDatePicker(datepicker){
    var obj=document.getElementById(datepicker);
    if(obj.style.display=="block"){
        obj.style.display="none";
    }
    else{
        obj.style.display="block";
    }
    //날짜를 누르면 display=none으로 된 다음에
    //해당 날짜가 "날짜"에 입력되어야 함
    //크기를 조절할 수 없어 창 크기를 수정해야 함
    
}