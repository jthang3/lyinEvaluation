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

    let updatePost = (id) => {
        return(
            fetch(`${baseURL}/${getTodo}/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    isCompleted: true
                }),
                header: {
                    "Content-Type": "application/json"
                }
            })
        )
    }

    let editPost = (id,text) => {
        return(
            fetch(`${baseURL}/${getTodo}/${id}`, {
                method: "PUT",
                header: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: text,
                    isCompleted: false
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
    let getTodoListFromUser = document.querySelector(".todo--input");
    let getTrigger = document.querySelector(".todo--btn");
    let getPending = document.querySelector(".main--todo__pending");
    let getCompleted = document.querySelector(".main--todo__completed");
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
                    <p>${data.content}</p>
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
            this.#pending = this.#pending.slice(780)
            let pending = view.createTmp(this.#pending);
            let completed = view.completedTemp(this.#completed);
            view.render(view.getPending,pending);
            view.render(view.getCompleted,completed);
            view.getTrigger.onclick = () => {
                console.log(view.getTodoListFromUser.value)
                model.postTodoList(view.getTodoListFromUser.value);
                view.getTodoListFromUser.value = '';
            }
            view.getPending.onclick = (e) => {
                e.preventDefault();
                if(e.target.innerHTML === "Delete") {
                    let currentId = (e.target.parentNode.parentNode.id);
                    model.deletePost(currentId);
                }
                else if(e.target.innerHTML === "Complete") {
                    let currentId = (e.target.parentNode.parentNode.id);
                    model.updatePost(currentId).then(data => data.json()).then(console.log);
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
                        model.editPost(currentId,getUserInput.value);
                        mainList.style.opacity = "1";
                        editPost.style.display = "none";
                    }
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