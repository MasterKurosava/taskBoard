import {v4 as uuid} from 'uuid'
import {getFromStorage,addToStorage} from '../localStorage';
import maket from '../../additions/maket.html'
//создаем юзера для проверок
export class User {
  constructor(login, password) {
    this.login = login;
    this.password = password;
    this.status="user";
  }
  //проверяем правильно введены ли данные.
  get rightLogin() {
    let users = getFromStorage("users")
    if (users == undefined) return false;
    for (let user of users) {
      if (user.login == this.login && user.password == this.password) {
        this.describs=user.describs;
        this.id=user.id;
        this.html=user.html;
        this.lastChange=user.lastChange
        return true;
      }
    }
    return false;
  }
  //проверяем свободен ли логин. Если да- пропускаем
  get freeLogin() {
    let users = getFromStorage("users")
    if (users == undefined) {
      this.id=uuid();
      this.describs=new Array;
      this.html=maket;
      this.lastChange="";
      addToStorage(this,"users");
      return true;
    } else {
      for (let user of users) {
        if (user.login == this.login) {
          return false
        }
      }
    }
    this.id=uuid()
    this.describs=new Array;
    this.html=maket;
    this.lastChange="";
    addToStorage(this, "users");
    return true;
  }
  //проверяем на админа.
  get isAdmin(){
    const users=getFromStorage('users');
    for(let user of users){
      if(user.status=='admin'){
        if(this.login==user.login && this.password==user.password) return true;
      }
    }
    return false;
  }
}
export class Admin{
  constructor(login,password){
    this.login=login;
    this.password=password;
    this.id=uuid;
    this.status="admin";
  }
}