//html
import loginWindow from '../../additions/login.html'
import registerWindow from '../../additions/registr.html'
import listWindow from '../../additions/usersList.html'
//js
import { getForm,removeCurrentUser,saveChanges,setCurrentUser } from '../processing';
import {newEventListener} from'./loadComponents'
import {getFromStorage} from'../localStorage'
import {backBtn} from './loadComponents'

const content = document.querySelector('.content'),
      registerBtn=document.querySelector('.header_registerButton'),
      loginBtn=document.querySelector('.header_loginButton'),
      logoutBtn=document.querySelector('.header_outButton'),
      loadingWindow=document.createElement('section');
//открываем окно регистрации
async function loadWindow(action){
  action=='register'?
  loadingWindow.innerHTML=registerWindow
  :loadingWindow.innerHTML=loginWindow
  content.appendChild(loadingWindow)
  
  //обработчик зыкрытия окна
  document.body.addEventListener('click',unFocusLogin)
  //нажатия на подверждение
  const form=document.querySelector('form');
  form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const formData= new FormData(form)
    getForm(formData,action)
  })
}
//нажимаем вне логина
function unFocusLogin(e){
  e.target==document.querySelector('.Window')?
  closeLogin('closeLogin')
  :{}
}


//открываем карточки пользователя
export async function openCards(attr, data=''){
  if(attr=='closeLogin'){
    closeLogin()
  }else if(attr=='close'){
    content.innerHTML=''
  }else if(attr=='closeAll'){
    closeLogin()
    content.innerHTML=''
  }
  const container=document.createElement('div');
  container.innerHTML=data;
  await content.appendChild(container)
  //если мы не вышли из аккаунта
  if(data!=''){
    fillFooter()//показываем выполненные задачи
    newEventListener() //вешаем обработчики на подгруженный контент
  }
}
//открываем список пользователя для админа
export function showUsers() {
  localStorage.removeItem('currentUser')
  content.innerHTML=''
  const block=document.createElement('div');
  block.innerHTML=listWindow;
  content.append(block);
  const users=getFromStorage('users')
  const list=content.querySelector('.list_body');
  for(let user of users){
    if(user.status!='admin'){//админов не выводим
      list.append(userLabel(user))
    }
  }
  content.querySelectorAll('.list_login').forEach((el)=>{//вешаем на все логины обработчик откртия
    el.addEventListener('click',showUser,{once:true})
  })
}
//создать поле юзера
function userLabel(user) {
  const label=document.createElement('li')
  label.classList.add('list_user');
  label.innerHTML=`<a class="list_login" id="${user.id}" href="#">${user.login}</a>
  <p class="list_password">${user.password}</p>
  <p class="list_lastChange">${user.lastChange}</p>`;
  return label;
}
//открыть карточки юзера при клике
function showUser(event) {
  const userId=event.target.getAttribute('id');
  const users=getFromStorage('users');
  for(let user of users){
    if(user.id==userId){
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser('close');
      content.prepend(backBtn);
      backBtn.addEventListener('click',showUsers,{once:true})
    }
  }
}
//показываем описание карточки
export function showDescrib(event){
  if((event.target).parentNode.classList.contains('trash'))return;//если нажали на удалить, то отменяется показ
  const data=JSON.parse(localStorage.currentUser).describs;
  let i=0;
  while(i<data.length){
    if(event.currentTarget.getAttribute('id')==data[i].id){
      const el=new DOMParser().parseFromString(data[i].html,"text/html")
      content.append(el.querySelector('.des_container'))
      break
    }
    i++
  }
  const closebtn=document.querySelector('.des_closeBtn')
  closebtn.addEventListener('click',()=>saveDescrib(i),{once:true})
}
//сохраняем изменения
function saveDescrib(i) {
  const describ=document.querySelector('.des_container');
  const data=JSON.parse(localStorage.currentUser);
  data.describs[i].html=describ.outerHTML;
  localStorage.setItem('currentUser', JSON.stringify(data))
  describ.remove()
  saveChanges()
}
//выводим кол-во задач
export function fillFooter(){
  const tasks=document.querySelector('.tasks').childNodes,
        ready=document.querySelector('.ready-js').childNodes,
        finished=document.querySelector('.finished-js').childNodes,
        changeLabel=document.querySelector('.lastTime');
  tasks[1].innerHTML=`Активные задачи: ${ready.length-1}`;
  tasks[3].innerHTML=`Законченные задачи: ${finished.length-1}`;
  changeLabel.innerHTML=`Последнее обновление: ${JSON.parse(localStorage.currentUser).lastChange}`
}
//закрываем окно
export function closeLogin(){
  document.body.removeEventListener('click',unFocusLogin)
  content.removeChild(loadingWindow)
}

//Меняем вкладки логина и регистрации в зависимости от переданного action
export function logToggle(action){
    const container=logoutBtn.parentNode
    logoutBtn.classList.toggle('hide')
  if(action=="logout"){
    removeCurrentUser()
    container.prepend(registerBtn)
    container.prepend(loginBtn)
  }else{
    container.removeChild(registerBtn)
    container.removeChild(loginBtn) 
  }
}

registerBtn.addEventListener('click',()=>loadWindow('register'))
loginBtn.addEventListener('click',()=>loadWindow('login'))
logoutBtn.addEventListener('click',()=>logToggle("logout"))