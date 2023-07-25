const openTaskPlanner = document.querySelector("#open-task-planner");
const closeTaskPlanner = document.querySelector("#close-task-planner");
const newTaskPlannerContainer = document.querySelector(
  "#new-task-planner-container"
);
const inputSearch = document.querySelector("#input-search");
const saveDraftBtn = document.querySelector("#save-draft");
const publishBtn = document.querySelector("#publish");
const updateBtn = document.querySelector("#update");
const cancelBtn = document.querySelector("#cancel");
const refresh = document.querySelector("#refresh");
const taskPlannerFullView = document.querySelector("#task-planner-full-view");
const closeTaskPlannerFullView = document.querySelector(
  "#close-task-planner-full-view"
);
const newTaskPlannerHeading = document.querySelector(".new-task-planner-heading");
let newTaskPlannerTitle = document.querySelector("#new-task-planner");
let newTaskPlannerDescription = document.querySelector("#editor .ql-editor");
const showTaskPlannerContainer = document.querySelector("#show-task-planner");
const loadMoreBtn = document.querySelector("#load-more");
const url = "http://127.0.0.1:5000/task-planner";
let waitListenerToRequestQuery = true;

const emptyNewTaskPlanner = () => {
  newTaskPlannerDescription = document.querySelector(
    "#editor .ql-editor"
  ).innerHTML = "";
  newTaskPlannerTitle = document.querySelector("#new-task-planner").value = "";
};
openTaskPlanner.addEventListener("click", () => {
  updateBtn.disabled = true;
  publishBtn.disabled = false;
  newTaskPlannerHeading.innerText = "New Task Planner"
  newTaskPlannerContainer.classList.add("show");
  emptyNewTaskPlanner();
});

closeTaskPlanner.addEventListener("click", () => {
  newTaskPlannerContainer.classList.remove("show");
});

cancelBtn.addEventListener("click", () => {
  emptyNewTaskPlanner();
});

closeTaskPlannerFullView.addEventListener("click", () => {
  taskPlannerFullView.classList.remove("show");
});

refresh.addEventListener("click", () => {
  refresh.classList.add("loading");
  getTaskPlanner();
});

const showTaskPlanner = (taskPlanner) => {
  showTaskPlannerContainer.innerHTML = "";
  for (let x in taskPlanner) {
    let col = document.createElement("div");
    col.setAttribute("class", "col mb-3");
    col.innerHTML = `
    <div
    class="w3-leftbar w3-border-grey w3-border rounded w3-hover-shadow p-2 task-planner-card" data-key=${taskPlanner[x].id}
  >
    <div class="d-flex justify-content-between">
      <h4 class="me-2 task-planner-title text-capitalize w3-text-red">
        <b>${taskPlanner[x].title}</b>
      </h4>
      <i class="bi bi-chevron-up w3-large expand-task-planner-description"></i>
    </div>
    <div class="mt-2">
      <div class="task-planner-content">
        ${taskPlanner[x].content}
      </div>
      <div class="d-flex justify-content-end w3-small tools-task-planner " style="flex-wrap: wrap;">
      <i class="bi bi-eye-fill text-primary me-3 full-view"></i>
      <i class="bi bi-pencil-square text-success me-3 edit-task-planner"></i>
      <i class="bi bi-trash text-danger me-3 delete-task-planner"></i>
        <i class="bi bi-clock text-secondary me-2"></i>
        <i class="text-secondary">${taskPlanner[x].date_created}</i>
      </div>
    </div>
  </div>
    `;
    showTaskPlannerContainer.appendChild(col);
    refresh.classList.remove("loading");
    loadMoreBtn.classList.remove("loading");
  }
  taskPlannerFunctions();
};

const taskPlannerFunctions = () => {
  const viewTaskPlanners = document.querySelectorAll(".full-view");
  viewTaskPlanners.forEach((x) => {
    x.addEventListener("click", () => {
      taskPlannerFullView.classList.add("show");
      let parent = x.parentElement.parentElement.parentElement;
      taskPlannerFullView.querySelector(
        ".task-planner-full-view-title"
      ).innerText = parent.querySelector(".task-planner-title").innerText;
      taskPlannerFullView.querySelector(
        ".task-planner-full-view-content"
      ).innerHTML = parent.querySelector(".task-planner-content").innerHTML;
    });
  });

  const deleteTaskPlanners = document.querySelectorAll(".delete-task-planner");
  deleteTaskPlanners.forEach((x) => {
    x.addEventListener("click", () => {
      let parent = x.parentElement.parentElement.parentElement;
      if (confirm("Are you sure you want to delete this task planner?")) {
        deleteTaskPlanner(parent, parent.dataset.key);
      }
    });
  });

  const expandTaskPlanners = document.querySelectorAll(
    ".expand-task-planner-description"
  );
  expandTaskPlanners.forEach((x) => {
    x.addEventListener("click", () => {
      let parent = x.parentElement.parentElement.querySelector(
        ".task-planner-content"
      );
      parent.classList.toggle("hide");
      if (parent.classList.contains("hide")) {
        x.classList.replace("bi-chevron-up", "bi-chevron-down");
      } else {
        x.classList.replace("bi-chevron-down", "bi-chevron-up");
      }
    });
  });

  const editTaskPlanners = document.querySelectorAll(".edit-task-planner");
  editTaskPlanners.forEach((x) => {
    x.addEventListener("click", () => {
      newTaskPlannerContainer.classList.add("show");
      updateBtn.disabled = false;
      publishBtn.disabled = true;
      let parent = x.parentElement.parentElement.parentElement;
      newTaskPlannerContainer.dataset.key = parent.dataset.key;
      newTaskPlannerTitle = parent.querySelector(
        ".task-planner-title"
      ).innerText;
      newTaskPlannerDescription = parent.querySelector(
        ".task-planner-content"
      ).innerHTML;
      newTaskPlannerHeading.innerText = "Update Task Planner"
      document.querySelector("#new-task-planner").value = newTaskPlannerTitle;
      document.querySelector("#editor .ql-editor").innerHTML =
        newTaskPlannerDescription;
    });
  });

  const imageTaskPlanners = document.querySelectorAll(
    ".task-planner-content img"
  );
  imageTaskPlanners.forEach((x) => {
    x.classList.add("img-fluid");
  });
};

const getTaskPlanner = () => {
  loadMoreBtn.classList.add("loading");
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showTaskPlanner(data);
    });
};
getTaskPlanner();

const postTaskPlanner = (title, description) => {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
    }),
  })
    .then((res) => res.text())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      console.log("Done");
    });
};

const validateTaskPlanner = () => {
  newTaskPlannerTitle = document.querySelector("#new-task-planner").value;
  newTaskPlannerDescription =
    document.querySelector("#editor .ql-editor").innerHTML;
  if (
    newTaskPlannerTitle.length >= 5 &&
    newTaskPlannerDescription.length >= 10
  ) {
    return newTaskPlannerTitle, newTaskPlannerDescription;
  }
};

publishBtn.addEventListener("click", () => {
  if (validateTaskPlanner()) {
    postTaskPlanner(newTaskPlannerTitle, newTaskPlannerDescription);
  }
});

const deleteTaskPlanner = (parent, key) => {
  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: key,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, key);
      parent.remove();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      console.log("Done");
    });
};

const updateTaskPlanner = (key, title, description) => {
  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: key,
      title: title,
      description: description,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      console.log("Done");
      loadMoreBtn.classList.remove("loading");
    });
};

updateBtn.addEventListener("click", () => {
  loadMoreBtn.classList.add("loading");
  newTaskPlannerContainer.classList.remove("show");
  if (validateTaskPlanner()) {
    updateTaskPlanner(
      newTaskPlannerContainer.dataset.key,
      newTaskPlannerTitle,
      newTaskPlannerDescription
    );
  }
});

const search = () => {
  setTimeout(() => {
    fetch(
      `http://localhost:5000/task-planner/search/?query=${inputSearch.value}`
    )
      .then((res) => res.json())
      .then((data) => {
        showTaskPlanner(data);
      });
    waitListenerToRequestQuery = true;
  }, 1000);
};

inputSearch.addEventListener("input", () => {
  if (waitListenerToRequestQuery) {
    waitListenerToRequestQuery = false;
    refresh.classList.add("loading");
    loadMoreBtn.classList.add("loading");
    showTaskPlannerContainer;
    showTaskPlannerContainer.innerHTML = "";
    search();
  }
});
