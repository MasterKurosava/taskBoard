import components from '../../additions/components/comp.html'
import {saveChanges} from '../processing.js'
import {fillFooter,showDescrib} from './loadHtml.js'
import {v4 as uuid} from 'uuid'
const components_m=new DOMParser().parseFromString(components,"text/html"),
      submitBtn=components_m.querySelector('.submitBtn'),
      inputList=components_m.querySelector('.board_input'),
      dropDown=components_m.querySelector('.dropdown'),
      deleteBtn=components_m.querySelector('.trash'),
      discr=components_m.querySelector('.des_container');
let currentList,
    currentBtn;

export const backBtn=components_m.querySelector('.back-js');
export function newEventListener(){
  //вешаем addBtn
  const addBtn=document.querySelector('.board_add');
  addBtn.addEventListener('click',(e)=>{
    currentBtn=(e.target).parentNode;
    currentBtn==undefined?{}:newTask();
  })
  //вешаем deleteBtn
  const trashBtns=document.querySelectorAll('.trash');
  trashBtns.forEach((el)=>{deleteListener(el.parentNode)});
  //вешаем showDescribtion
  const taskItems=document.querySelectorAll('.taskItem');
  taskItems.forEach((el)=>{
    el.addEventListener('click',showDescrib)
  })
  //вешаем addDropdown
  const addDrops=document.querySelectorAll('.board_addDrop');
  addDrops.forEach((el)=>{
    el.addEventListener('click',e=>{
      currentBtn=e.currentTarget;
      showDropdown();
    })
  })
}
//удаляем элемент списка
function deleteListener(el){
  const btn=el.querySelector('div')
  btn.addEventListener('click',()=>{
    el.remove();
    fillFooter();
    saveChanges()
  })
}
//показываем дропдаун элементов прошлого списка
async function showDropdown(){
  currentList=currentBtn.previousElementSibling.childNodes[1];
  const prevList=(currentList.parentNode.parentNode.previousElementSibling).querySelector('.board_list');
  let data='';
  if(prevList.childNodes.length<2) return;
  currentBtn.innerHTML=``;
  currentBtn.after(dropDown);
  for(let i=1;i<prevList.childNodes.length;i++){
    data+=`<li class="dropDown_item">${prevList.childNodes[i].childNodes[0].innerHTML}</li>`;
  }
  dropDown.querySelector('.dropdown-menu').innerHTML=data;
  dropDown.querySelector('.dropdown-menu').classList.add('show');
  const dropItems=document.querySelectorAll('.dropDown_item')
  dropItems.forEach((el)=>{
    el.addEventListener('click',(e)=>addDropdown(e,prevList))
  })
  document.addEventListener('click',dropUnfocus)
}
//добавили и убрали новый пункт
function addDropdown(e,prevList){
  document.removeEventListener('click',dropUnfocus)
  for(let i=1;i<prevList.childNodes.length;i++){
    if(prevList.childNodes[i].childNodes[0].innerHTML==e.target.innerHTML){
      currentList.append(prevList.childNodes[i])
      break;
    }
  }
  currentBtn.nextElementSibling.remove();
  returnAdd();
}

//нажали на add card
function newTask(){
  currentList=currentBtn.previousElementSibling.childNodes[1];
  currentBtn.innerHTML=``;
  currentBtn.append(submitBtn);
  currentList.append(inputList);
  document.addEventListener('click',addUnfocus)
  submitBtn.addEventListener('click',checkNewTask);
}
//нажали на submit
function checkNewTask(){
  document.removeEventListener('click',addUnfocus)
  submitBtn.removeEventListener('click',checkNewTask)
  const newTask=inputList.querySelector('input').value
  if(newTask.length<5){
    alert('Слишком короткое значение');
  }else if(newTask.length>100){
    alert('Слишком длинное значение');
  }else{
    inputList.querySelector('input').value='';
    setNewTask(newTask);
  }
}
//добавляем новый список
function setNewTask(newTask){
  const id=uuid();
  let el=document.createElement('li');
  el.setAttribute('id',id)
  el.setAttribute('class','taskItem')
  el.innerHTML=`<p>${newTask}</p>${deleteBtn.outerHTML}`;
  currentList.append(el);
  document.querySelector('.board_input').remove();
  createDescrib(el,id) //добавляем описание задачи
  deleteListener(el);  //обработчик нового deleteBtn
  returnAdd(); //возвращаем к прежнему виду
}
//создаем описание задачи и записываем в LS юзера
function createDescrib(el,taskId) {
  const element=discr;
  element.querySelector('h1').innerHTML=el.querySelector('p').innerHTML;
  const newDescrib={
    id:taskId,
    html:element.outerHTML
  };
  const currentUser=JSON.parse(localStorage.currentUser);
  currentUser.describs.push(newDescrib);
  localStorage.setItem('currentUser',JSON.stringify(currentUser));
  el.addEventListener('click',showDescrib)
}
function returnAdd(){
  fillFooter();
  currentBtn.innerHTML = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAv0lEQVRIie2UQQ7BQBSGv3/uwIKN81g5AFZEUm6AVR2hFWGlR7BxnHbhHJ6FSNqlUU3D/Lv/JfN9mZnkQUhDkc+h8SoeOXQETNj8nGwv7zKcj9jhUqADdA3t/RhesV6p9BsUf54gDuLfE1c212QZD4VSxKBWi1EgRVmyvr5GlRtLOtQuBZ5MO5VHbfljLYD8C57c3W1WMflQpqudlXuWbN7mtOWpgziI/1ZsFKXmtXD8xFIEuoFu7m6RFyOkqTwA2BEkGZKElWYAAAAASUVORK5CYII="><p>Add Card</p>`
  saveChanges();
}

//анфокусинг первой карточки
function addUnfocus(e) {
  const target=e.target;
  if(target.parentNode===inputList || target===submitBtn|| target.parentNode==null){
    return;
  }else{
    currentList.removeChild(inputList)
    currentBtn.innerHTML = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAv0lEQVRIie2UQQ7BQBSGv3/uwIKN81g5AFZEUm6AVR2hFWGlR7BxnHbhHJ6FSNqlUU3D/Lv/JfN9mZnkQUhDkc+h8SoeOXQETNj8nGwv7zKcj9jhUqADdA3t/RhesV6p9BsUf54gDuLfE1c212QZD4VSxKBWi1EgRVmyvr5GlRtLOtQuBZ5MO5VHbfljLYD8C57c3W1WMflQpqudlXuWbN7mtOWpgziI/1ZsFKXmtXD8xFIEuoFu7m6RFyOkqTwA2BEkGZKElWYAAAAASUVORK5CYII="><p>Add Card</p>`
    document.removeEventListener('click',addUnfocus)
  }
}

//анфокусинг остальных карточек
function dropUnfocus(e) {
  const target=e.target;
  if(target.classList.contains('dropDown_item') || target.parentNode==null) return;
  else{
    currentBtn.nextElementSibling.remove()
    currentBtn.innerHTML = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAv0lEQVRIie2UQQ7BQBSGv3/uwIKN81g5AFZEUm6AVR2hFWGlR7BxnHbhHJ6FSNqlUU3D/Lv/JfN9mZnkQUhDkc+h8SoeOXQETNj8nGwv7zKcj9jhUqADdA3t/RhesV6p9BsUf54gDuLfE1c212QZD4VSxKBWi1EgRVmyvr5GlRtLOtQuBZ5MO5VHbfljLYD8C57c3W1WMflQpqudlXuWbN7mtOWpgziI/1ZsFKXmtXD8xFIEuoFu7m6RFyOkqTwA2BEkGZKElWYAAAAASUVORK5CYII="><p>Add Card</p>`
    document.removeEventListener('click',dropUnfocus)
  }

}