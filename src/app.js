//styles
import './styles/main.scss'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

//scripts
import {logToggle,showUsers} from './modules/loading/loadHtml.js'
import {setCurrentUser} from'./modules/processing.js'
import {hasAdmin} from'./modules/localStorage.js'

function checkCurrentUser(){
  if(localStorage.currentUser==undefined) return false;//если текущего пользователя нет, то ничего не делаем
  else{
    setCurrentUser()//выставляем текущего пользователя
    logToggle('login')//и убираем вкладки логина и регистрации
  }
}
if(localStorage.currentAdmin!=undefined){
  showUsers();
  logToggle('login');
}
checkCurrentUser()
hasAdmin();


