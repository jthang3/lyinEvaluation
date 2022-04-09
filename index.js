const API = (() => {
    let baseURL = `http://localhost:3000`;
    let getTodo = `todos`;

    let getToDoLists = () => {
        return(
            fetch([baseURL,getTodo].join("/"))
                .then(data => data.json())
        )
    }

    let postToDOLists = (postData) => {
        return(
            fetch([baseURL,getTodo].join("/"),{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: postData,
                    isCompleted: false
                })
            })
        ).then(data => data.json())
    }

    let deletePost = (id) => {
        return(
            fetch(`${baseURL}/${getTodo}/${id}`,{
                method: "DELETE",
                header: {
                    "Content-Type": "application/json"
                }
            }).then(data => data.json())
        )
    }

    let updatePost = (id,text,condition) => {
        return(
            fetch(`http://localhost:3000/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: text,
                    isCompleted: condition
                })
            })
        )
    }

    let editPost = (id,text,condition) => {
        return(
            fetch(`http://localhost:3000/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: text,
                    isCompleted: condition
                })
            })
        )
    }
    return {
        editPost,
        getToDoLists,
        postToDOLists,
        deletePost,
        updatePost
    }
})();



//View

const View = (() => {

    let editIcon = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>`
    let deleteIcon = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`
    let completeIcon = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>`
    let getTodoListFromUser = document.querySelector(".todo--input");
    let getTrigger = document.querySelector(".todo--btn");
    let getPending = document.querySelector(".main--todo__pending-lists");
    let getCompleted = document.querySelector(".main--todo__completed--lists");
    let getList = document.querySelector(".list--holder");
    let render = (ele,tmp) => {
        ele.innerHTML = tmp;
    }

    let createTmp = (arr) => {
        let tmp = '';
        arr.forEach(data => {
            tmp += `
                <div class = "list--holder" id = ${data.id}>
                    <p>${data.content}</p>
                    <div class = "btn">
                        <button class = "edit">Edit</button>
                        <button class = "delete">Delete</button>
                        <button class = "complete">Complete</button>
                    </div>
                </div>
            `
        })
        return tmp;
    }

    let completedTemp = (arr) => {
        let tmp = '';
        arr.forEach(data => {
            tmp += `
                <div class = "list--holder" id = ${data.id}>
                    <div class = "btn">
                        <button class = "reverse">Reverse</button>
                    </div>
                    <p>${data.content}</p>
                    <div class = "btn">
                        <button class = "edit">Edit</button>
                        <button class = "delete">Delete</button>
                    </div>
                </div>
            `
        })
        return tmp;
    }


    return {
        completedTemp,
        render,
        getPending,
        getTodoListFromUser,
        getTrigger,
        getCompleted,
        createTmp,
        getList
    }
})();

//Model

const Model = ((api) => {
    let todoLists = api.getToDoLists();
    let postTodoList = api.postToDOLists;
    let deletePost = api.deletePost;
    let updatePost = api.updatePost;
    let editPost = api.editPost;

    return {
        todoLists,
        postTodoList,
        deletePost,
        updatePost,
        editPost
    }
})(API)



//controller

const Controller = ((model,view)=> {
    let getTodoLists = model.todoLists;
    class State {
        #pending = [];
        #completed = [];

        get getpending () {
            return this.#pending;
        }

        set setTodos (arr) {
            arr.forEach(data => {
                data.isCompleted ? this.#completed.push(data): this.#pending.push(data);
            })
            let pending = view.createTmp(this.#pending);
            let completed = view.completedTemp(this.#completed);
            view.render(view.getPending,pending);
            view.render(view.getCompleted,completed);
            view.getTrigger.onclick = () => {
                model.postTodoList(view.getTodoListFromUser.value);
                view.getTodoListFromUser.value = '';
            }
            view.getPending.onclick = (e) => {
                if(e.target.innerHTML === "Delete") {
                    let currentId = (e.target.parentNode.parentNode.id);
                    model.deletePost(currentId);
                }
                else if(e.target.innerHTML === "Complete") {
                    
                    let currentId = (e.target.parentNode.parentNode.id);
                    let getValue = arr.filter(data => data.id == currentId);
                    let text = (getValue[0].content);
                    model.updatePost(currentId,text,true);
                }
                else if(e.target.innerHTML === "Edit") {
                    let currentId = (e.target.parentNode.parentNode.id);
                    let editPost = document.querySelector(".edit--post");
                    editPost.style.display = "block";
                    let mainList = document.querySelector('.main--todo__lists');
                    mainList.style.opacity = "0.5";
                    let getUserInput = document.querySelector(".edit--post-text");
                    let userClick = document.querySelector(".edit--post-btn");
                    userClick.onclick = () => {
                        model.editPost(currentId,getUserInput.value,false);
                        mainList.style.opacity = "1";
                        editPost.style.display = "none";
                    }
                }

            }

            view.getCompleted.onclick = (e) => {
                if(e.target.innerHTML === "Reverse") {
                    let currentId = e.target.parentNode.parentNode.id;
                    let getValue = arr.filter(data => data.id == currentId);
                    let text = (getValue[0].content);
                    model.updatePost(currentId,text,false);
                    
                }
                else if(e.target.innerHTML === "Edit") {
                    let currentId = (e.target.parentNode.parentNode.id);
                    let editPost = document.querySelector(".edit--post");
                    editPost.style.display = "block";
                    let mainList = document.querySelector('.main--todo__lists');
                    mainList.style.opacity = "0.5";
                    let getUserInput = document.querySelector(".edit--post-text");
                    let userClick = document.querySelector(".edit--post-btn");
                    userClick.onclick = () => {
                        model.editPost(currentId,getUserInput.value,true);
                        mainList.style.opacity = "1";
                        editPost.style.display = "none";
                    }
                }
                else if(e.target.innerHTML === "Delete") {
                    let currentId = (e.target.parentNode.parentNode.id);
                    model.deletePost(currentId);
                }
            }
        }
    }

    let init = () => {
        let state = new State();
        getTodoLists.then(data => {
            state.setTodos = data;
        })
    }

    return {
        init
    }
})(Model,View)


Controller.init();