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

function Item(name){
    this.status = 'active';
    this.name = name;
    this.id = ++Item.counter;
}

Item.counter = 0;

function Table(){
    this.rows = [];
}

Table.prototype = {
    constructor : Table,

    addItem : function(item){
        this.rows.unshift(item);
    },

    removeItem : function(item){
        for(let i = 0; i < this.rows.length; i++){
            if(this.rows[i].id == item.id){
                this.rows.splice(i,1);
            }
        }
    },

    removeAll : function(){
        this.rows = [];
    },

    loadData : function(){

        //Load Data to table if exists in storage! 
        if (storageAvailable('localStorage')) {
        // Yippee! We can use localStorage awesomeness
            if(!localStorage.getItem('todoAppRows')){
                //do nothing
            }else{
                this.rows = JSON.parse(localStorage.getItem('todoAppRows'));

                //also set Item.counter to last id !!!!
                if(this.rows.length === 0){
                    Item.counter = 0;
                }else{
                    Item.counter = this.rows[0].id;
                }
            }
        }else{
        // Too bad, no localStorage for us
            alert('Sorry! Couldn\'t access data!');
            this.rows =  [];
        }

    },

    saveData : function(){
        if (storageAvailable('localStorage')) {
            // Yippee! We can use localStorage awesomeness
            localStorage.setItem('todoAppRows',JSON.stringify(this.rows));
        }else{
            // Too bad, no localStorage for us
            alert('Sorry! Couldn\'t save data!');
        }
    },

    renderToDOM :function(root,page){
        
        //clear list
        let itemsList = root; //document.getElementById('items-list');
        while(itemsList.firstChild){
            itemsList.removeChild(itemsList.firstChild);
        }
        
        let instaceOfTable = this;
        this.rows.forEach( function(row){
        
            let item = document.createElement('li'),
                span = document.createElement('span'),
                btnStatus  = document.createElement('button'),
                btnDelete  = document.createElement('button');
            btnStatus.classList.add('btn-status');
            btnDelete.classList.add('btn-delete');
            span.classList.add('todo-text');
            span.innerHTML = row.name;

            item.appendChild(btnStatus);
            item.appendChild(btnDelete);
            item.appendChild(span);

            if( row.status === page || page === 'all'){
                itemsList.appendChild(item);
                itemsList.insertBefore(item, itemsList.childNodes[0]);

                        
                if(row.status === 'completed'){
                    item.classList.add('completed');
                    item.classList.remove('active');
                }else{
                    item.classList.remove('completed');
                    item.classList.add('active');
                }

                btnStatus.addEventListener('click',function(){
                    row.status === 'active' ? row.status = 'completed' : row.status = 'active';
                    let event = new Event('refreshDOM');
                    document.dispatchEvent(event);
                });
                btnDelete.addEventListener('click',function(){
                    instaceOfTable.removeItem(row);
                    let event = new Event('refreshDOM');
                    document.dispatchEvent(event);
                });
            }
        });      
    }     
};

window.onload = function(){

    let table = new Table,
        tableRootElement = document.getElementById('items-list'),
        eventRefreshDOM = new Event('refreshDOM'),
        page = 'all';

    table.loadData();
    table.renderToDOM(tableRootElement,page);

    //add new item (task) to todo List (table)
    //when user press enter on text field
    let textField = document.getElementById('text-field');
    textField.onkeyup = function(event){
        event.preventDefault();
        if(event.keyCode===13){
            let item = new Item(textField.value);
            table.addItem(item);
            document.dispatchEvent(eventRefreshDOM);
            textField.value = '';
        } 
    };

    //switch pages
    let btnAll = document.getElementById('btn-all'),
        btnActive = document.getElementById('btn-active'),
        btnCompleted = document.getElementById('btn-completed'),
        btnClear = document.getElementById('btn-clear');

    btnAll.onclick = function(){
        page = 'all';
        updateBtnClass('btn-all');
    };
    btnActive.onclick = function(){
        page = 'active';
        updateBtnClass('btn-active');
    };
    btnCompleted.onclick = function(){
        page = 'completed';
        updateBtnClass('btn-completed');
    };

    //remove completed tasks
    btnClear.onclick = function(){
        table.rows.forEach( function(row){
            if(row.status === 'completed'){
                table.removeItem(row);
            }
        });
        document.dispatchEvent(eventRefreshDOM);
    };

    //clear all data when user click delete All button!
    let button = document.getElementsByClassName('btn');
    button[0].onclick = () =>{
        table.removeAll();
        document.dispatchEvent(eventRefreshDOM);
    };

    document.addEventListener('refreshDOM', function(){
        table.renderToDOM(tableRootElement,page);
        //store data on every change
        table.saveData();
    });

    function updateBtnClass(btnId){
        let allBtn = document.getElementsByClassName('btn');
        for(let i = 0; i < allBtn.length; i++){
            allBtn[i].classList.remove('btn-active');
        }
        document.getElementById(btnId).classList.add('btn-active');
        document.dispatchEvent(eventRefreshDOM);
    }

};
