"use strict";

/*
New project modal - visual
add N/a checkbox to represent no due date / 'Due:' does not show in project

New project modal - code
prevent empty to-do's flowing to project view

Project view - code
edit button
change date format
dates in the past are read
high priority red or bold


Future changes
sort projects by date, priority, alphanumeric
click to expand / collapse changes based on state
potentially update architecture to MVC with pub/sub

*/

const containerProject = document.querySelector("#container");
const createProject = document.querySelector(".btn__newproject");
const formProject = document.querySelector(".form__project ");
const containerTodo = document.querySelector("#todo-container");

const Projects = (function () {
  let listProjects = [];
  let counter = 0;

  // const newProject = (projectName, projectDesc, priority, dueDate, todos) => {
  //   listProjects.push({
  //     projectName: `${projectName}`,
  //     projectDesc: `${projectDesc}`,
  //     priority: `${priority}`,
  //     dueDate: `${dueDate}`,
  //     todos: `${todos}`,
  //   });
  //   View.renderProjects();
  // };
  const getListProjects = () => listProjects;
  const deleteProject = (index) => listProjects.splice(index, 1);

  const newProject = (projectName, projectDesc, priority, dueDate, todos) => {
    listProjects.push({ projectName, projectDesc, priority, dueDate, todos });
    // console.log(listProjects);
    setLocalStorage();
    View.renderProjects();
  };

  const setLocalStorage = () => {
    localStorage.setItem("projects", JSON.stringify(listProjects));
  };

  const getLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem("projects"));
    if (!data) return;
    listProjects = data;

    View.renderProjects();
  };

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  const getCounter = () => counter;
  const increaseCounter = () => counter++;
  const resetCounter = () => (counter = 0);

  return {
    getListProjects,
    newProject,
    deleteProject,
    setLocalStorage,
    getLocalStorage,
    clearLocalStorage,
    getCounter,
    increaseCounter,
    resetCounter,
  };
})();

const View = (function () {
  const renderProjects = () => {
    containerProject.innerHTML = "";
    for (const [i, v] of Projects.getListProjects().entries()) {
      const html = `
      <div class="project" data-project="${i}">
      <button class="btn__project btn__deleteproject">❌</button>
          <button class="btn__project btn__editproject">✏️</button>
          <p>${v.projectName}<br>
          <span class="description">${
            v.projectDesc ? v.projectDesc : ""
          }</span></p>
          <span class="description">Priority: ${
            v.priority
          }</span><br><span class="description"> Due: ${v.dueDate}</span></p>
          <ul class="todo-list hidden">
          ${v.todos ? v.todos.map(renderTodos).join("") : ""}
          </ul>
          <span class="expand">Click to expand / collapse</span>
          </div>
      `;
      containerProject.insertAdjacentHTML("afterbegin", html);
    }
    Projects.setLocalStorage();
  };
  const renderTodos = (todo) => {
    const html = `
      <li class="todo">${todo}</li>
      `;
    return html;
  };
  return { renderProjects, renderTodos };
})();

createProject.addEventListener("click", function (e) {
  formProject.querySelector("#priority").selected = "selected";
  formProject.classList.remove("hidden");
});

containerProject.addEventListener("click", function (e) {
  if (!e.target.closest(".project")) return;
  const project = e.target.closest(".project");
  if (e.target.classList.contains("btn__deleteproject")) {
    Projects.deleteProject(project.dataset.project);
    View.renderProjects();
    return;
  }
  project.querySelector(".todo-list").classList.toggle("hidden");
  Projects.setLocalStorage();
});

const Handler = (function (e) {
  const closeForm = () => {
    formProject.querySelectorAll(".form__input").forEach((f) => (f.value = ""));
    formProject.classList.add("hidden");
  };

  const saveForm = () => {
    Projects.newProject(
      formProject.querySelector("#title").value,
      formProject.querySelector("#description").value,
      formProject.querySelector("#priority").value,
      formProject.querySelector("#due-date").value,
      formProject.querySelectorAll(".input__todo")
        ? [...formProject.querySelectorAll(".input__todo")].map((x) => [
            x.value,
          ])
        : [formProject.querySelector(".input__todo").value]
    );
    formProject.querySelectorAll(".form__input").forEach((f) => (f.value = ""));
    formProject.classList.add("hidden");
  };

  const addTodo = () => {
    Projects.increaseCounter();
    const html = `
    <button class="btn__deletetodo" data-counter="${Projects.getCounter()}">❌</button>
    <input type="text" class="input__todo" name="todo" data-counter="${Projects.getCounter()}" /><br data-counter="${Projects.getCounter()}"/>
    `;
    containerTodo.insertAdjacentHTML("beforeend", html);
  };

  const deleteTodo = (e) => {
    const target = e.target.dataset.counter;
    if (target < 1) return;
    let elements = formProject.querySelectorAll(`[data-counter="${target}"`);
    elements.forEach((x) => x.remove());
  };

  return { closeForm, saveForm, addTodo, deleteTodo };
})();

formProject.addEventListener("click", function (e) {
  if (e.target.closest(".btn__closeform")) {
    e.preventDefault();
    Handler.closeForm();
  }
  if (e.target.closest(".btn__saveform")) {
    e.preventDefault();
    Handler.saveForm();
  }
  if (e.target.closest(".btn__addtodo")) {
    e.preventDefault();
    Handler.addTodo();
  }
  if (e.target.closest(".btn__deletetodo")) {
    e.preventDefault();
    Handler.deleteTodo(e);
  }
});

// Prevent empty array being sent
document.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  if (formProject.classList.contains("hidden")) return;
  Handler.saveForm();
});

// Projects.clearLocalStorage();
Projects.getLocalStorage();
