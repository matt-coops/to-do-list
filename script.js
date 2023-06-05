"use strict";

const container = document.querySelector("#container");
const createProject = document.querySelector("#create--project");
const inputProject = document.querySelector(".new--project--input");
const inputDesc = document.querySelector(".new--project--desc--input");

const Controller = function () {};

const Projects = (function () {
  let listProjects = [];

  const newProject = (projectName, projectDesc, dueDate, priority) => {
    listProjects.push({
      projectName: `${projectName}`,
      projectDesc: `${projectDesc}`,
      dueDate: `${dueDate}`,
      priority: `${priority}`,
    });
    View.renderProjects();
  };
  const getListProjects = () => listProjects;
  const deleteProject = (index) => listProjects.splice(index, 1);

  const newTodo = () => {
    return { title, description, dueDate, priority };
  };

  const setLocalStorage = () => {
    localStorage.setItem("projects", JSON.stringify(listProjects));
  };

  const getLocalStorage = () => {
    const data = JSON.parse(localStorage.getItem("projects"));
    if (!data) return;
    console.log(data);
    listProjects = data;
    View.renderProjects();
  };

  return {
    newTodo,
    getListProjects,
    newProject,
    deleteProject,
    setLocalStorage,
    getLocalStorage,
  };
})();

const View = (function () {
  const renderProjects = () => {
    container.innerHTML = "";
    for (const [i, v] of Projects.getListProjects().entries()) {
      const html = `
      <div class="project" data-project="${i}">
      <button class="project--btn delete--project">❌</button>
          <button class="project--btn edit--project">➕</button>
          <p>${v.projectName}<br>
          <span class="description">${
            v.projectDesc ? v.projectDesc : ""
          }</span></p>
          <ul class="todo-list">
          ${v.todos ? v.todos.map(renderTodos).join("") : ""}
        </div></ul>
      `;
      container.insertAdjacentHTML("afterbegin", html);
    }
    Projects.setLocalStorage();
  };
  const renderTodos = (todo) => {
    const html = `
      <li class="todo hidden">${todo}
    </li>
      `;
    return html;
  };
  return { renderProjects, renderTodos };
})();

createProject.addEventListener("click", function (e) {
  if (!inputProject.value) return;
  Projects.newProject(inputProject.value, inputDesc.value);
  inputDesc.value = "";
  inputProject.value = "";
});

container.addEventListener("click", function (e) {
  if (!e.target.closest(".project")) return;
  const project = e.target.closest(".project");
  if (e.target.classList.contains("delete--project")) {
    Projects.deleteProject(project.dataset.project);
    View.renderProjects();
    return;
  }
  project
    .querySelectorAll(".todo")
    .forEach((t) => t.classList.toggle("hidden"));
  Projects.setLocalStorage();
});

Projects.getLocalStorage();
