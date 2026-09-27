// =========================
// DOM Elements
// =========================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");


// =========================
// Application State
// =========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// =========================
// Save Tasks
// =========================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// =========================
// Display Tasks
// =========================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        li.innerHTML = `
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <div class="task-actions">

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    ✏️
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    🗑️
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });


    updateTaskCount();


    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}


// =========================
// Add Task
// =========================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false
    };


    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
}


// =========================
// Toggle Task
// =========================

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();

    renderTasks();
}


// =========================
// Edit Task
// =========================

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }


    const updatedText = prompt("Edit your task:", task.text);


    if (updatedText === null) {
        return;
    }


    const cleanText = updatedText.trim();


    if (cleanText === "") {
        alert("Task cannot be empty.");
        return;
    }


    task.text = cleanText;

    saveTasks();

    renderTasks();
}


// =========================
// Delete Task
// =========================

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


// =========================
// Task Counter
// =========================

function updateTaskCount() {

    const remainingTasks = tasks.filter(
        task => !task.completed
    ).length;


    if (remainingTasks === 1) {

        taskCount.textContent = "1 task remaining";

    } else {

        taskCount.textContent =
            `${remainingTasks} tasks remaining`;
    }
}


// =========================
// Clear Completed Tasks
// =========================

function clearCompletedTasks() {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();

    renderTasks();
}


// =========================
// Filter Tasks
// =========================

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        button.classList.add("active");


        currentFilter =
            button.dataset.filter;


        renderTasks();
    });
});


// =========================
// Button Events
// =========================

addTaskBtn.addEventListener("click", addTask);

clearCompletedBtn.addEventListener(
    "click",
    clearCompletedTasks
);


// =========================
// Enter Key Support
// =========================

taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask();
    }
});


// =========================
// Security Helper
// =========================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// =========================
// Initial Render
// =========================

renderTasks();