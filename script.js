// Select elements from the DOM
inp = document.querySelector('.task-input input')  // Input field for entering a task
taskBox_UL = document.querySelector('.task-box')  // The UL (unordered list) where tasks will be displayed
filtersBtn = document.querySelectorAll('.filter span')  // Filter buttons (All, Pending, Completed)
let todos = JSON.parse(localStorage.getItem('To-Do List App'))  // Get the 'To-Do List App' from local storage
let isEdited = false;  // Flag to track if a task is being edited
let editID = '';  // ID of the task being edited

// Clear all tasks event listener
document.querySelector('.clear-all').addEventListener("click",function(){
    // Clear all tasks from the 'todos' array
    todos.splice(0, todos.length)
    // Update local storage with the empty array
    localStorage.setItem('To-Do List App', JSON.stringify(todos))
    // Show all tasks (empty)
    showData_html("all")
})

// Add event listeners to filter buttons (All, Pending, Completed)
filtersBtn.forEach(function(b){
    b.addEventListener('click',function(){ 
        // Call showData_html() to filter tasks based on the filter clicked
        showData_html(b.id)
    })
})

// Function to show a menu for each task (Edit, Delete)
function showMenu(el){ 
    el.nextElementSibling.classList.add('show')  // Show the menu (edit/delete options)
    document.addEventListener('click',function(e){
        // Close the menu if the user clicks outside of it
        if(e.target !== el){
            el.nextElementSibling.classList.remove('show')
        }
    })
}

// Function to handle task editing
function updateTask(id, task){
    console.log(id, task)  // For debugging
    isEdited = true;  // Set flag indicating a task is being edited
    editID = id  // Save the task ID for future edits
    inp.value = task  // Set input field to the current task name
}

// Function to handle task deletion
function deleteTask(el){
    // Get the task ID from the element that triggered the delete
    delId = el.parentElement.parentElement.previousElementSibling.querySelector('input').getAttribute('id')
    // Remove the task from the todos array
    todos.splice(delId, 1)
    // Update local storage with the updated todos array
    localStorage.setItem('To-Do List App', JSON.stringify(todos))
    // Show the updated list of tasks
    showData_html("all")
}

// Function to update the task's completion state
function updateState(inpF){ 
    // If the checkbox is checked, mark task as completed
    if(inpF.checked){
        inpF.parentElement.lastElementChild.classList.add('checked-task')  // Add 'checked' class to the task's paragraph
        todos[inpF.id].status = 'Completed'  // Update task status to 'Completed'
    } else {
        inpF.parentElement.lastElementChild.classList.remove('checked-task')  // Remove 'checked' class
        todos[inpF.id].status = 'Pending"'  // Update task status to 'Pending'
    }
    // Update local storage with the new task state
    localStorage.setItem('To-Do List App', JSON.stringify(todos))
}

// Function to display tasks based on the selected filter
function showData_html(filterID){
    let li = "";  // String to accumulate HTML for the tasks
    
    if(todos){
        todos.forEach(function(todo, id){
            console.log(id, todo)  // For debugging
            if(todo){
                // Determine if task is completed
                isCompleted = (todo.status == 'Completed') ? "checked" : ""
                // If the task matches the selected filter, add it to the list
                if(filterID == todo.status || filterID == "all"){
                    li += ` 
                        <li class="task-list">
                            <label for="${id}">
                                <input type="checkbox" onclick="updateState(this)" id="${id}" ${isCompleted}>
                                <p class='${isCompleted}'>${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="fa fa-ellipsis-h" aria-hidden="true"></i>
                                <ul class="edit-menu">
                                    <li onclick="updateTask(${id}, '${todo.name}')"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</li>
                                    <li onclick="deleteTask(this)" > <i class="fa fa-trash-o" aria-hidden="true"></i> Delete</li>
                                </ul>   
                            </div>
                        </li>     
                    `
                }
            }
        })
    }

      

    // Update the DOM with the new list of tasks
    taskBox_UL.innerHTML = li  
}

// Event listener for when the user presses the 'Enter' key in the input field
inp.addEventListener('keyup',function(e){
    inpValue = inp.value.trim()  // Get the trimmed value from the input field
    if(e.key === "Enter"){  // If the user presses 'Enter'
        if(inpValue === "") return; // Prevent adding empty tasks


        if(!isEdited){  // If not editing an existing task
            if(!todos){  // If the todos array is empty, initialize it
                todos = []
            } 
            // Create a new task object and add it to the todos array
            var inp_obj = {name: inpValue, status: "Pending"} 
            todos.push(inp_obj) 
        } else {  // If editing an existing task
            todos[editID].name = inp.value  // Update the task name
            isEdited = false;  // Reset the edit flag
        }
        // Update local storage with the updated todos array
        localStorage.setItem('To-Do List App', JSON.stringify(todos))
        inp.value = ""  // Clear the input field
        // Show the updated list of tasks
        showData_html("all")
    }
})

// Show all tasks on page load
showData_html("all")