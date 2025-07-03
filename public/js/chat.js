const newMsg = document.getElementById("new-message");
const api = "http://localhost:3000";

const usersLoggedIn = JSON.parse(localStorage.getItem("users")) || [];

function showUserJoined(user) {
  const userList = document.querySelector(".chatbox-messages");
  const userDiv = document.createElement("div");
  userDiv.className = "user-joined";
  userDiv.textContent = `${user} joined in`;
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
    newMsg.value = "";
  } catch (error) {
    console.log(error);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/html/login.html";
}

usersLoggedIn.forEach((user) => showUserJoined(user));
