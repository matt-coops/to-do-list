"use strict";

const containerProject = document.querySelector("#container");
const createProject = document.querySelector(".btn__newproject");
const formProject = document.querySelector(".form__project ");
const containerTodo = document.querySelector(".todo-container");

const Projects = (function () {
  let listProjects = [];

  const newProject = (projectName, projectDesc, priority, dueDate, todos) => {
    listProjects.push({
      projectName: `${projectName}`,
      projectDesc: `${projectDesc}`,
      priority: `${priority}`,
      dueDate: `${dueDate}`,
      todos: `${todos}`,
    });
    View.renderProjects();
  };
  const getListProjects = () => listProjects;
  const deleteProject = (index) => listProjects.splice(index, 1);

  const newTodo = (projectName, projectDesc, priority, dueDate, todos) => {
    listProjects.push({ projectName, projectDesc, priority, dueDate, todos });
    console.log(listProjects);
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

  return {
    newTodo,
    getListProjects,
    newProject,
    deleteProject,
    setLocalStorage,
    getLocalStorage,
    clearLocalStorage,
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
          <ul class="todo-list">
          ${v.todos ? v.todos.map(renderTodos).join("") : ""}
        </div></ul>
      `;
      containerProject.insertAdjacentHTML("afterbegin", html);
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
  formProject.querySelector("#due-date").value = new Date()
    .toISOString()
    .substring(0, 10);
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
  project
    .querySelectorAll(".todo")
    .forEach((t) => t.classList.toggle("hidden"));
  Projects.setLocalStorage();
});

formProject.addEventListener("click", function (e) {
  if (e.target.closest(".btn__closeform")) {
    e.preventDefault();
    formProject.querySelectorAll(".form__input").forEach((f) => (f.value = ""));
    formProject.classList.add("hidden");
  }
  if (e.target.closest(".btn__saveform")) {
    e.preventDefault();
    Projects.newTodo(
      formProject.querySelector("#title").value,
      formProject.querySelector("#description").value,
      formProject.querySelector("#priority").value,
      formProject.querySelector("#due-date").value,
      formProject.querySelectorAll(".todo")
        ? [...formProject.querySelectorAll(".todo")].map((x) => [x.value])
        : [formProject.querySelector(".todo").value]
    );
    formProject.querySelectorAll(".form__input").forEach((f) => (f.value = ""));
    formProject.classList.add("hidden");
  }
  if (e.target.closest(".btn__addtodo")) {
    e.preventDefault();
    const html = `
    <button class="btn__deletetodo">❌</button>
    <input type="text" class="form__input todo" name="todo" /><br />
    `;
    containerTodo.insertAdjacentHTML("beforeend", html);
  }
});

// DRY
document.addEventListener("keydown", function (e) {
  if (e.key !== "Enter") return;
  if (formProject.classList.contains("hidden")) return;
  Projects.newTodo(
    formProject.querySelector("#title").value,
    formProject.querySelector("#description").value,
    formProject.querySelector("#priority").value,
    formProject.querySelector("#due-date").value,
    formProject.querySelectorAll(".todo")
      ? [...formProject.querySelectorAll(".todo")].map((x) => [x.value])
      : [formProject.querySelector(".todo").value]
  );
  formProject.querySelectorAll(".form__input").forEach((f) => (f.value = ""));
  formProject.classList.add("hidden");
});

// Projects.clearLocalStorage();
Projects.getLocalStorage();
