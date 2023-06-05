"use strict";

const container = document.querySelector("#container");
const createProject = document.querySelector("#create--project");
const inputProject = document.querySelector(".new--project--input");
const inputDesc = document.querySelector(".new--project--desc--input");

const Controller = function () {};

const Projects = (function () {
  const listProjects = [
    {
      projectName: "Project 0",
      projectDesc: "this is a test",
      todos: ["Test", "Test2", "Test3"],
    },
    {
      projectName: "Project 1",
      projectDesc: "this is a test",
      todos: ["Test", "Test2", "Test3"],
    },
    {
      projectName: "Project 2",
      projectDesc: "this is a test",
      todos: ["Test", "Test2", "Test3"],
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

  const newTodo = () => {
    return { title, description, dueDate, priority };
  };

  return { newTodo, getListProjects, newProject };
})();

const View = (function () {
  const renderProjects = () => {
    container.innerHTML = "";
    for (const [i, v] of Projects.getListProjects().entries()) {
      const html = `
      <div class="project" data-project="${i}">
      <button class="project--btn delete--project">❌</button>
          <button class="project--btn edit--project">✏️</button>
          <p>${v.projectName}<br>
          <span class="description">${
            v.projectDesc ? v.projectDesc : ""
          }</span></p>
        </div>
      `;
      container.insertAdjacentHTML("afterbegin", html);
    }
  };
  return { renderProjects };
})();

createProject.addEventListener("click", function (e) {
  if (!inputProject.value) return;
  console.log(inputDesc.value);
  Projects.newProject(inputProject.value, inputDesc.value);
  inputDesc.value = "";
  inputProject.value = "";
});

View.renderProjects();

container.addEventListener("click", function (e) {
  const project = e.target.closest(".project");
  if (e.target.classList.contains("delete--project")) {
    console.log("true");
  }
});
