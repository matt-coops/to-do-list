"use strict";

const container = document.querySelector("#container");
const createProject = document.querySelector(".btn__newproject");
const formNewProject = document.querySelector(".form__project ");

const Projects = (function () {
  let listProjects = [
    {
      projectName: "Test",
      projectDesc: "This is test data",
      dueDate: "Tomorrow",
      priority: "High",
      todos: [
        "This is a test todo - 1",
        "This is a test todo - 2",
        "This is a test todo - 3",
      ],
    },
  ];

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
    listProjects = [];
    data.forEach((p) => listProjects.push(p));
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
      <button class="btn__project btn__deleteproject">❌</button>
          <button class="btn__project btn__editproject">✏️</button>
          <p>${v.projectName}<br>
          <span class="description">${
            v.projectDesc ? v.projectDesc : ""
          }</span><br>
          <span class="description">Priority: ${v.priority}, Due: ${
        v.dueDate
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
  formNewProject.classList.remove("hidden");
});

container.addEventListener("click", function (e) {
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

Projects.getLocalStorage();
