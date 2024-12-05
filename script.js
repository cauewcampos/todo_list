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
