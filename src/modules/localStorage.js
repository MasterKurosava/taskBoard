import { Admin } from "./building/User";

function getFromStorage(key){
  if(localStorage.getItem(key)==undefined){
    localStorage.setItem(key,"[]")
  }else{
    return JSON.parse(localStorage.getItem(key) || "[]")
  }
}
function addToStorage(obj,key){
  const storageData=getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key,JSON.stringify(storageData))
}
function createAdmins() {
  const admin=new Admin('admin','123456');
  addToStorage(admin,"users")
}
function hasAdmin() {
  const users=getFromStorage("users");
  if(users==undefined){
    createAdmins();
  }
}
export {getFromStorage, addToStorage, hasAdmin}