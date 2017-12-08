
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

window.onload = function(){

    let todoList = [];
    todoList = retrieveList();

    let textField = document.getElementById('text-field');
    //add existing list elements to DOM 
    let itemsList = document.getElementById('items-list');
    todoList.forEach( (row) => {
        let item = document.createElement('li');
        item.innerHTML = row;
        itemsList.appendChild(item);    
        item.addEventListener('click',function(){changeLi(item);});
    });

    textField.onkeyup = function(event){
        event.preventDefault();
        
        if(event.keyCode===13){
            let itemsList = document.getElementById('items-list'),
                item = document.createElement('li');

            //item.setAttribute('')
            item.innerHTML = textField.value;
            itemsList.appendChild(item);
            itemsList.insertBefore(item, itemsList.childNodes[0]);
            item.addEventListener('click',function(){changeLi(item);});
            
            todoList.unshift(textField.value);
            saveList(todoList);
        }
    };

    function changeLi(list){
        list.innerHTML = 'Changed!';
    }

};
