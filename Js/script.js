// Selecting the input elements, the fields where the filter buttons are located,
// the button to clear all data and the area where the inputs will be
// allocated
const task_input = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId,
isEditTask = false,
// Getting localStorage to do list
tasks = JSON.parse(localStorage.getItem("to-do-list"));

// Do a 'for' operation for each element of an array(element in one of the filters)
// Creating the function btn
filters.forEach(btn => {
// When btn is clicked, the function removeActive()
// This function remove class 'active' from 'span'
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
// Then is add a class 'active' to btn

        btn.classList.add("active");
        showTasks(btn.id);
    });
});

// Creating the function showTasks calling 'filter' as argument
function showTasks(filter) {
// Creating an empty var
    
    let liTag = "";
// Creating a conditional with calls the JSON var
if(tasks){
    // For each element on JSON is referenced task and id,
    // after that is created a function
            tasks.forEach((task, id) =>{
    // var completed  is equal to task.status is exactly equal to 'complete'
    // so '?' is used to represents if...else operator
    // Basically it works comparing task.status and if is True give  'checked' value
    // else the '' value is give
            let completed = task.status == 'completed' ? 'checked' : "";
    // If filter is totally equal to task.status or to value 'all'
            if(filter == task.status || filter == "all"){
    // Var 'liTag' is equal to itself more what comes next
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${task.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${task.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTasks("all");

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        tasks[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        tasks[selectedTask.id].status = "pending";
    }
    localStorage.setItem("to-do-list", JSON.stringify(tasks))
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    task_input.value = textName;
    task_input.focus();
    task_input.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    tasks.splice(deleteId, 1);
    localStorage.setItem("to-do-list", JSON.stringify(tasks));
    showTasks(filter);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    tasks.splice(0, tasks.length);
    localStorage.setItem("to-do-list", JSON.stringify(tasks));
    showTasks()
});

task_input.addEventListener("keyup", e => {
    let userTask = task_input.value.trim();
    if(e.key == "Enter" && userTask) {
        if(!isEditTask) {
            tasks = !tasks ? [] : tasks;
            let taskInfo = {name: userTask, status: "pending"};
            tasks.push(taskInfo);
        } else {
            isEditTask = false;
            tasks[editId].name = userTask;
        }
        task_input.value = "";
        localStorage.setItem("to-do-list", JSON.stringify(tasks));
        showTasks(document.querySelector("span.active").id);
    }
});