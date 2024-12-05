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
