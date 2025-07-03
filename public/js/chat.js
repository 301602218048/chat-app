const newMsg = document.getElementById("new-message");
const api = "http://localhost:3000";

const usersLoggedIn = JSON.parse(localStorage.getItem("users")) || [];

document.addEventListener("DOMContentLoaded", initialize);

async function initialize() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${api}/chat/fetchmessage`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    response.data.messages.forEach((msg) => addToDOM(msg.message, 1));
  } catch (error) {
    console.log(error);
  }
}

function addToDOM(user, msg) {
  const userList = document.querySelector(".chatbox-messages");
  const userDiv = document.createElement("div");
  if (msg) {
    userDiv.textContent = user;
  } else {
    userDiv.className = "user-joined";
    userDiv.textContent = `${user} joined in`;
  }
  userList.appendChild(userDiv);
}

async function sendData(e) {
  try {
    e.preventDefault();
    const newMessage = {
      message: newMsg.value,
    };
    const token = localStorage.getItem("token");
    const response = await axios.post(`${api}/chat/sendmessage`, newMessage, {
      headers: { Authorization: `Bearer ${token}` },
    });
    addToDOM(newMsg.value, 1);
    newMsg.value = "";
  } catch (error) {
    console.log(error);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/html/login.html";
}

usersLoggedIn.forEach((user) => addToDOM(user, 0));
