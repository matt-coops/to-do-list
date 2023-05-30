"use strict";

const container = document.querySelector("#container");
const createProject = document.querySelector("#create--project");
const inputProject = document.querySelector("#new--project--input");

const Controller = function () {};

const Desktop = (function () {
  const listProjects = [
    { projectName: "Project 1", todos: ["Test", "Test2", "Test3"] },
    { projectName: "Project 2", todos: ["Test", "Test2", "Test3"] },
    { projectName: "Project 3", todos: ["Test", "Test2", "Test3"] },
    { projectName: "Project 4", todos: ["Test", "Test2", "Test3"] },
    { projectName: "Project 5", todos: ["Test", "Test2", "Test3"] },
  ];
  const newProject = (projectName) => {
    listProjects.push({ projectName: `${projectName}` });
    render();
  };
  const getListProjects = () => listProjects;
  return { newProject, getListProjects };
})();

const Projects = (function () {
  const listTodo = [];

  const setListTodo = (todo) => listTodo.push(todo);
  const getListTodo = () => listTodo;
  const newTodo = (title, description, dueDate, priority) => {
    return { title, description, dueDate, priority };
  };

  return { newTodo, setListTodo, getListTodo };
})();

const render = function () {
  container.innerHTML = "";
  for (const x of Desktop.getListProjects()) {
    const html = `
    <div class="project">
        <button class="edit--project">✏️</button>
        <button class="delete--project">❌</button>
        <p>${x.projectName}</p>
      </div>
    `;
    container.insertAdjacentHTML("afterbegin", html);
  }
};

createProject.addEventListener("click", function (e) {
  if (!inputProject.value) return;
  Desktop.newProject(inputProject.value);
  console.log(Desktop.getListProjects());
});

render();

Projects.setListTodo(Projects.newTodo("Titler", "Desc", "Tomorrow", "Low"));
Projects.setListTodo(Projects.newTodo("Titler", "Desc", "Tomorrow", "Low"));
Projects.setListTodo(Projects.newTodo("Titler", "Desc", "Tomorrow", "Low"));
