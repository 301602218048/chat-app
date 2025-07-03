const userList = document.querySelector(".chatbox-messages");
const newMsg = document.getElementById("new-message");
const api = "http://localhost:3000";

const usersLoggedIn = JSON.parse(localStorage.getItem("users")) || [];

document.addEventListener("DOMContentLoaded", fetchAndShowChat);

usersLoggedIn.forEach((user) => addToDOM(user, 0));

function addToDOM(user, msg) {
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
  localStorage.removeItem("messages");
  const users = JSON.parse(localStorage.getItem("users"));
  if (users.length > 0) {
    users.pop();
  }
  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "/html/login.html";
}

function updateChat(message, from) {
  const newMessage = document.createElement("div");
  newMessage.innerHTML = `
          <span>${from}:</span><p>${message}</p>
      `;
  userList.appendChild(newMessage);
}

async function fetchAndShowChat() {
  let oldText = JSON.parse(localStorage.getItem("messages"));
  let lastMsgId;
  if (!oldText || oldText.length === 0) {
    oldText = [];
    lastMsgId = 0;
  } else {
    lastMsgId = oldText[oldText.length - 1].id;
  }

  const token = localStorage.getItem("token");
  const response = await axios.get(
    `http://localhost:3000/chat/fetchchat/${lastMsgId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (response.status == 200) {
    const newMsg = response.data.chat;
    let msg = oldText.concat(newMsg);

    if (msg.length > 20) {
      msg = msg.slice(msg.length - 20, msg.length);
    }
    localStorage.setItem("messages", JSON.stringify(msg));
    msg.forEach((element) => {
      updateChat(element.message, element.from);
    });
  }
}
