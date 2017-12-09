
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

function retrieveList(){
    if (storageAvailable('localStorage')) {
        // Yippee! We can use localStorage awesomeness
        if(!localStorage.getItem('todoList')){
            return [];
        }else{
            return JSON.parse(localStorage.getItem('todoList'));
        }

    }else{
        // Too bad, no localStorage for us
        alert('Sorry! Couldn\'t access data!');
        return [];
    }
}

function saveList(list){
    if (typeof(Storage) !== 'undefined') {
        localStorage.setItem('todoList',JSON.stringify(list));
    }else{
        alert('Sorry! Couldn\'t save data!');
    }
}

function changeTaskStatus(task){
    task.innerHTML = 'Changed!';
}

function deleteTask(task){
    task.innerHTML = 'Deleted!';
}

function updateDOMList(list){

    //clear list
    let itemsList = document.getElementById('items-list');
    while(itemsList.firstChild){
        itemsList.removeChild(itemsList.firstChild);
    }
    //add existing list elements to DOM 
    list.forEach( (row) => {
        addElement(row);
    });
}

function addElement(task){
    let itemsList = document.getElementById('items-list'),
        item = document.createElement('li'),
        taskText = document.createTextNode(task.name),
        btnStatus  = document.createElement('button'),
        btnDelete  = document.createElement('button');

    item.appendChild(btnStatus);
    item.appendChild(taskText);
    item.appendChild(btnDelete);
    itemsList.appendChild(item);
    itemsList.insertBefore(item, itemsList.childNodes[0]);
    btnStatus.addEventListener('click',function(){changeTaskStatus(item);});
    btnDelete.addEventListener('click',function(){deleteTask(item);});
}

window.onload = function(){
    
    let todoList = [];
    todoList = retrieveList();
    console.log(todoList);
    updateDOMList(todoList);

    //delete all button
    let button = document.getElementsByClassName('btn');
    button[0].onclick = () =>{
        localStorage.clear();
        todoList = retrieveList();
        updateDOMList(todoList);
    };

    //add task to list 
    let textField = document.getElementById('text-field');
    textField.onkeyup = function(event){
        event.preventDefault();
        
        if(event.keyCode===13){
            let task = {'name':textField.value,'status':'active'};
            addElement(task);    
            todoList.unshift(task);
            saveList(todoList);
        }
    };

};
