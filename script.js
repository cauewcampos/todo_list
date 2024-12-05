const userName = document.getElementById("new_user_name");
const userImg = document.getElementById("new_img_url");
const addBtn = document.querySelector("#addUser_btn");
const usersContainer = document.getElementById("users");

const saveToLocalStorage = (users) => {
    localStorage.setItem("usersData", JSON.stringify(users));
};

const loadFromLocalStorage = () => {
    const usersData = localStorage.getItem("usersData");
    return usersData ? JSON.parse(usersData) : [];
};

let users = loadFromLocalStorage();

const id_newUser = () => {
    let currentId = parseInt(localStorage.getItem("lastId")) || 0;
    localStorage.setItem("lastId", currentId + 1);
    return currentId + 1;
};

const saveNewUser = (avatar, name, id = null, tasks = [], saveToStorage = true) => {
    
    const userId = id || id_newUser();
    const divProfile = document.createElement("section");
    divProfile.classList.add("user_page");
    divProfile.dataset.userId = userId;

    const userProfile = document.createElement("div");
    userProfile.classList.add("user_profile");
    divProfile.appendChild(userProfile);

    const userImage = document.createElement("img");
    const formattedAvatar = avatar.endsWith(".png") ? avatar : `${avatar}.png`;
    userImage.src = formattedAvatar;
    userImage.alt = "Foto de perfil do usuário";
    userImage.classList.add("user_image");
    userProfile.appendChild(userImage);

    const userNameElement = document.createElement("h3");
    userNameElement.innerText = name;
    userNameElement.classList.add("user_name");
    userProfile.appendChild(userNameElement);

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn_Edit", "edit_profile");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    userProfile.appendChild(editBtn);

    const remBtn = document.createElement("button");
    remBtn.classList.add("btn_Rem", "rm_profile");
    remBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    userProfile.appendChild(remBtn);

    const configUser = document.createElement("div");
    configUser.classList.add("config_user");
    divProfile.appendChild(configUser);

    const newTaskInput = document.createElement("input");
    newTaskInput.type = "text";
    newTaskInput.name = "text";
    newTaskInput.classList.add("new_task");
    newTaskInput.placeholder = "Novo afazer";
    configUser.appendChild(newTaskInput);

    const addNewTaskBtn = document.createElement("button");
    addNewTaskBtn.classList.add("add_newTask");
    addNewTaskBtn.innerText = "+ Adicionar Tarefa";
    configUser.appendChild(addNewTaskBtn);

    const userTasksContainer = document.createElement("div");
    userTasksContainer.classList.add("tasks_container");
    divProfile.appendChild(userTasksContainer);

    tasks.forEach((task) => renderTask(userTasksContainer, task.tarefa, task.completed));

    addBtn.addEventListener("click", () => {
        const taskValue = newTaskInput.value.trim();
        if (taskValue === "") {
            alert("Por favor, preencha a tarefa!");
            return;
        }
        const task = { tarefa: taskValue, completed: false };
        renderTask(userTasksContainer, taskValue, false);

        const user = users.find((u) => u.id === userId);
        user.afazeres.push(task);
        saveToLocalStorage(users);

        newTaskInput.value = "";
    });

    usersContainer.appendChild(divProfile);

    if (saveToStorage) {
        users.push({ id: userId, name, avatar, afazeres: [] });
        saveToLocalStorage(users);
    }
};

const renderTask = (container, taskText, completed) => {
    const userTasks = document.createElement("div");
    userTasks.classList.add("user_tasks");

    const taskCheck = document.createElement("input");
    taskCheck.type = "checkbox";
    taskCheck.checked = completed;
    userTasks.appendChild(taskCheck);

    const taskTextElement = document.createElement("p");
    taskTextElement.innerText = taskText;
    userTasks.appendChild(taskTextElement);

    const editTaskBtn = document.createElement("button");
    editTaskBtn.classList.add("btn_Edit", "edit_task");
    editTaskBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    userTasks.appendChild(editTaskBtn);

    const remTaskBtn = document.createElement("button");
    remTaskBtn.classList.add("btn_Rem", "rm_task");
    remTaskBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    userTasks.appendChild(remTaskBtn);

    editTaskBtn.addEventListener("click", () => {
        const newTaskValue = prompt("Edite a tarefa:", taskTextElement.innerText);
        if (newTaskValue && newTaskValue.trim() !== "") {
            taskTextElement.innerText = newTaskValue;
            const userId = container.closest(".user_page").dataset.userId;
            const user = users.find((u) => u.id == userId);
            const task = user.afazeres.find((t) => t.tarefa === taskText);
            task.tarefa = newTaskValue;
            saveToLocalStorage(users);
        } else {
            alert("O campo de tarefa não pode estar vazio.");
        }
    });

    remTaskBtn.addEventListener("click", () => {
        userTasks.remove();
        const userId = container.closest(".user_page").dataset.userId;
        const user = users.find((u) => u.id == userId);
        user.afazeres = user.afazeres.filter((t) => t.tarefa !== taskText);
        saveToLocalStorage(users);
    });

    container.appendChild(userTasks);
};

addBtn.addEventListener("click", () => {
    const userNameValue = userName.value.trim();
    const userImgValue = userImg.value.trim();

    if (userNameValue && userImgValue) {
        saveNewUser(userImgValue, userNameValue);
        userName.value = "";
        userImg.value = "";
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

renderUsers();
