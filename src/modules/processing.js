import {User} from './building/User'
import {openCards,logToggle,fillFooter,showUsers} from './loading/loadHtml';

export function getForm(formData, action) {
  const login = formData.get('login');
  const password = formData.get('password');
  if (login.length > 0 && password.length > 0 && login.length <20 && password.length <20) {
    const user = new User(login, password)
    if (action == 'login') {
      if(user.isAdmin){//если ввели данные админа
        localStorage.setItem('currentAdmin',JSON.stringify(user))
        logToggle('login')//убираем login и register
        showUsers()//показываем всех юзеров
        return;
      }
      else if(!user.rightLogin) {
        alert('Неверный логин или пароль');
        return false;
      }
    } else {
      if (!user.freeLogin) {
        alert('Логин уже занят, попробуйте другой')
        return false;
      }
    }
    localStorage.setItem('currentUser', JSON.stringify(user))
    setCurrentUser('closeAll')
    logToggle('login')
  }
}
//выставляем текущего юзера
export function setCurrentUser(attr) {
  const cardData = JSON.parse(localStorage.currentUser).html;
  openCards(attr, cardData);
}

export function removeCurrentUser() {
  localStorage.currentAdmin!=undefined?localStorage.removeItem('currentAdmin'):{}//удаляем текущего админа, если он есть
  localStorage.removeItem('currentUser')//удаляем текущего пользователя
  openCards('close');
}

//сохраняем изменения
export async function saveChanges() {
  const board = document.querySelector('.board').outerHTML, //текущий html
  currentUser = JSON.parse(localStorage.currentUser), //текущий пользователь
  currentData = JSON.parse(localStorage.users),//весь LS
  describs=currentUser.describs,//список описаний
  date = new Date(),
  lastTime = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}`;//новое время
  //обновляем текущего юзера,время его последнего изменения и LS юзера
  currentUser.html = board; //новый html
  currentUser.lastChange = lastTime//новое время изменения
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  for (let i = 0; i < currentData.length; i++) {
    if (currentData[i].id == currentUser.id) {
      currentData[i].describs=describs;
      currentData[i].html = board;
      currentData[i].lastChange = lastTime;
      localStorage.setItem('users', JSON.stringify(currentData));
      break
    }
  }
  fillFooter()
}