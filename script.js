const storageTodoList = {
  index: function () {
    let todoList = JSON.parse(localStorage.getItem('todo-list'));

    return todoList;
  },

  insert: function (todoList) {
    localStorage.setItem('todo-list', JSON.stringify(todoList));
  }
}

// lista de tarefas
let todoList = [];

const clearInputValue = () => document.getElementById('texto-tarefa').value = '';

const getOl = () => document.getElementById('lista-tarefas');

const getInputValue = () => document.getElementById('texto-tarefa').value;

const getBtnAdd = () => document.getElementById('criar-tarefa');

const getBtnRemoveFinalized = () => document.getElementById('remover-finalizados');

const getBtnRemoveAll = () => document.getElementById('apaga-tudo');

const getBtnRemoveSelected = () => document.getElementById('remover-selecionado');

const getBtnSave = () => document.getElementById('salvar-tarefas');

const getLiAll = () => document.getElementsByTagName('li');

const getLiCompleted = () => document.querySelectorAll('.completed');

const createLi = () => document.createElement('li');

const createBtn = () => document.createElement('button');

const createDiv = () => document.createElement('div');

function removeLi(li) {
  let ols = getOl();
  ols.removeChild(li.parentNode);
}

function deleteTodo(event) {
  let li = event.target.parentNode;
  removeLi(li);
}

function upTodo(event) {
  let myOl = event.target.parentNode.parentNode.parentNode;
  let myDivForUp = event.target.parentNode.parentNode;

  if (myOl.childNodes[0] == myDivForUp) return;

  let myDivForDown = event.target.parentNode.parentNode.previousSibling;
  myOl.insertBefore(myDivForUp, myDivForDown);

  let myLiValue = event.target.parentNode.parentNode.childNodes[0].innerText;

  let index = todoList.findIndex((a) => a.value == myLiValue);
  todoList.splice(index - 1, 0, todoList[index]);
  todoList.splice(index + 1, 1);
}

function downTodo(event) {
  let myOl = event.target.parentNode.parentNode.parentNode;
  let myDivForDown = event.target.parentNode.parentNode;

  if (myOl.childNodes[myOl.childNodes.length - 1] == myDivForDown) return;

  let myDivForUp = event.target.parentNode.parentNode.nextSibling;
  myOl.insertBefore(myDivForUp, myDivForDown);

  let myLiValue = event.target.parentNode.parentNode.childNodes[0].innerText;

  let index = todoList.findIndex((a) => a.value == myLiValue);
  todoList.splice(index + 2, 0, todoList[index]);
  todoList.splice(index, 1);
}

function insertPropertyInElement({ element = '', text = '', textHTML = '', classe = '', identify = '' }) {
  if (element) {
    let myElement = element;
    if (text) myElement.innerText = text;
    if (textHTML) myElement.innerHTML = textHTML;
    if (classe) myElement.classList.add(classe);
    if (identify) myElement.id = identify;
  }
}

// insere evento em botao delete
function insertBtnDelete() {
  let btn = createBtn();
  insertPropertyInElement({
    element: btn,
    textHTML: 'delete',
    classe: 'btn-delete',
    identify: 'btn-delete',
  });
  btn.addEventListener('click', function (event) {
    deleteTodo(event);
  });
  return btn;
}

// insere evento em botao up
function insertBtnUp() {
  let btn = createBtn();
  insertPropertyInElement({
    element: btn, 
    textHTML: 'up &uarr;',
    classe: 'mover-cima',
    identify: 'mover-cima',
  });
  btn.addEventListener('click', function (event) {
    upTodo(event);
  });
  return btn;
}

// insere event em botao down
function insertBtnDown() {
  let btn = createBtn();
  insertPropertyInElement({
    element: btn, 
    textHTML: 'down &darr;', 
    classe: 'mover-baixo', 
    identify: 'mover-baixo',
  });
  btn.addEventListener('click', function (event) {
    downTodo(event);
  });
  return btn;
}

// armazena o li que foi splitado
let liCurrentSplited;

// adicionando evendo de double click no li
function eventLiDblClick(li) {
  li.addEventListener('dblclick', function () {
    li.classList.toggle('completed');
    let lis = getLiAll();
    for (let index = 0; index < lis.length; index += 1) {
      if (lis[index].className == 'completed') todoList[index].classes = 'completed';
      else todoList[index].classes = '';
    }
  });
}

function insertButtonsInLi() {
  let btnUp = insertBtnUp();
  let btnDown = insertBtnDown();
  let btnDelete = insertBtnDelete();
  let divForButton = createDiv();

  divForButton.className = 'item-button';
  divForButton.appendChild(btnUp);
  divForButton.appendChild(btnDown);
  divForButton.appendChild(btnDelete);

  return divForButton;
}

function insertLiInOl(text, classe) {
  let divForLi = createDiv();
  divForLi.className = 'todo-list-item';

  let ol = getOl();
  let li = createLi();

  let divForButton = insertButtonsInLi();

  insertPropertyInElement({ text: text, element: li, classe: classe });
  eventLiDblClick(li);

  divForLi.appendChild(li);
  divForLi.appendChild(divForButton);

  ol.appendChild(divForLi);
  todoList.push({ value: text, classes: '' });
}

let btnAdd = getBtnAdd();
btnAdd.addEventListener('click', function () {
  let lis = getLiAll();
  for(let index = 0; index < lis.length; index += 1){
    if(getInputValue() == lis[index].innerText) return clearInputValue();
  }
  if (getInputValue()) insertLiInOl(getInputValue());
  clearInputValue();
});

// remove finalizados
let btnRemoveFinalized = getBtnRemoveFinalized();
btnRemoveFinalized.addEventListener('click', function () {
  let li = getLiAll();
  console.log(li)
  for (let index = 0; index < li.length; index += 1) {
    if (li[index].className == 'completed') {
      removeLi(li[index]);
      todoList.splice(index - 1, 1);
    }
  }
  console.log(todoList)
});

// remove todos
const btnRemoveAll = getBtnRemoveAll();
btnRemoveAll.addEventListener('click', function () {
  let ol = getOl();
  ol.innerHTML = '';
  todoList = [];
});

// save storage
const btnSave = getBtnSave();
btnSave.addEventListener('click', function () {
  storageTodoList.insert(todoList);
});

window.onload = function () {
  todoList = storageTodoList.index();

  if (todoList) {
    for (let index = 0; index < todoList.length; index += 1) {
      insertLiInOl(todoList[index].value, todoList[index].classes);
    }
  }
}
