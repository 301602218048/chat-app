const api = "http://localhost:3000";
const chatList = document.querySelector(".chatbox-messages");
const newMsg = document.getElementById("new-message");
const createGroupBtn = document.getElementById("create-group-btn");
const createGroupForm = document.getElementById("create-group-form");
const username = document.getElementById("current-user");
const addMemberBtn = document.getElementById("add-member");
const multimediaInput = document.getElementById("multimedia");
const addMemberForm = document.getElementById("add-member-form");
const closeButtons = document.querySelectorAll("#close-btn");
const groupList = document.getElementById("group-list");
const memberList = document.getElementById("members-list");
const showMembers = document.getElementById("show-members");

const groupId = localStorage.getItem("activeGroup");

const overlay = document.createElement("div");
overlay.classList.add("popup-overlay");
document.body.appendChild(overlay);

var socket = io();
socket.on("connect", () => {
  console.log(`you are connected with ${socket.id}`);
});

function openPopup(popup) {
  popup.style.display = "block";
  overlay.style.display = "block";
}

function closePopup(popup) {
  popup.style.display = "none";
  overlay.style.display = "none";
}

createGroupBtn.addEventListener("click", () => openPopup(createGroupForm));

addMemberBtn.addEventListener("click", () => openPopup(addMemberForm));

closeButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    closePopup(createGroupForm);
    closePopup(addMemberForm);
  })
);

overlay.addEventListener("click", () => {
  closePopup(createGroupForm);
  closePopup(addMemberForm);
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      document.body.style.display = "block";
      users = JSON.parse(localStorage.getItem("users"));
      username.innerHTML = `<b>${users[users.length - 1]}</b>`;
      displayGroupOnLoad();
    } else {
      window.location.href = "/html/login.html";
    }
  } catch (err) {
    console.log(err);
  }
});

async function displayGroupOnLoad() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${api}/group/getallgroups`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    groupList.innerHTML = "";

    const groupName = response.data.groups;
    if (groupName) {
      groupName.forEach((group) => {
        groupList.innerHTML += `
             <li id="${group.id}" style="display: flex; justify-content: space-between; align-items: center;">
            <span class="name">${group.name}</span>
            <button class="del">X</button>
            </li>
             `;
      });
    }
  } catch (error) {
    console.log(error);
  }
}

let intervalId;

groupList.addEventListener("click", (e) => {
  let groupId;
  if (e.target.nodeName === "BUTTON") {
    const confirmDelete = confirm(
      "Are you sure you want to delete this group?"
    );
    if (confirmDelete) {
      groupId = e.target.parentElement.id;
      clearInterval(intervalId);
      return deleteGroup(groupId);
    } else {
      return;
    }
  }
  if (e.target.nodeName === "SPAN") {
    groupId = e.target.parentElement.id;
    localStorage.setItem("activeGroup", groupId);
    socket.emit("join room", groupId);
    socket.on("joined", (room) => {
      fetchAndShowChat(groupId);
    });
    // fetchAndShowChat(groupId);
    // clearInterval(intervalId);
    // intervalId = setInterval(() => {
    //   fetchAndShowChat(groupId);
    // }, 1000);
  }
});

async function sendData(e) {
  try {
    e.preventDefault();
    const groupId = localStorage.getItem("activeGroup");
    const newMessage = {
      file: multimediaInput.value,
      message: newMsg.value,
      groupId,
    };
    const token = localStorage.getItem("token");
    const response = await axios.post(`${api}/chat/sendmessage`, newMessage, {
      headers: { Authorization: `Bearer ${token}` },
    });
    socket.emit("new message", response);
    newMsg.value = "";
  } catch (error) {
    console.log(error);
  }
}
socket.on("message recieved", (message) => {
  let msg = message.data;
  updateChat(msg.message, msg.name);
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("messages");
  localStorage.removeItem("activeGroup");
  const users = JSON.parse(localStorage.getItem("users"));
  if (users.length > 0) {
    users.pop();
  }
  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "/html/login.html";
}

function updateChat(message, from) {
  const newMessage = document.createElement("div");
  if (from === username.textContent) {
    newMessage.classList.add("chatbox-message-sent");
    newMessage.innerHTML = `
        <span>You:</span>
        <p>${message}</p>
    `;
  } else {
    newMessage.classList.add("chatbox-message");
    newMessage.innerHTML = `
        <span>${from}:</span>
        <p>${message}</p>
    `;
  }
  chatList.appendChild(newMessage);
}

async function fetchAndShowChat(groupId) {
  let oldText = JSON.parse(localStorage.getItem("messages"));
  let lastMsgId;
  if (!oldText || oldText.length === 0) {
    oldText = [];
    lastMsgId = 0;
  } else {
    lastMsgId = oldText[oldText.length - 1].id;
  }

  const token = localStorage.getItem("token");
  const response = await axios.get(`${api}/chat/fetchchat/${lastMsgId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status == 200) {
    const newMsg = response.data.chat;
    let msg = oldText.concat(newMsg);

    if (msg.length > 20) {
      msg = msg.slice(msg.length - 20, msg.length);
    }
    localStorage.setItem("messages", JSON.stringify(msg));

    const msgToShow = msg.filter((item) => item.groupId == groupId);
    chatList.innerHTML = "";
    msgToShow.forEach((element) => {
      updateChat(element.message, element.from);
    });
  }
}

async function deleteGroup(groupId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${api}/group/deletegroup/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert(response.data.message);
    if (response.data.success) {
      displayGroupOnLoad();
    }
  } catch (error) {
    console.log(error);
  }
}

showMembers.addEventListener("click", () => {
  const groupId = localStorage.getItem("activeGroup");
  fetchAndShowMembers(groupId);
});

async function fetchAndShowMembers(groupId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${api}/admin/getallmembers/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    updateMemberList(response.data.members);
  } catch (error) {
    console.log(error);
  }
}

function updateMemberList(members) {
  memberList.addEventListener("click", (e) => handleMembers(e));
  memberList.innerHTML = "";

  members.forEach((member) => {
    const isAdmin = member.isAdmin;
    const name = member.dataValues.name;
    const id = member.dataValues.id;

    memberList.innerHTML += `
      <li class="${
        isAdmin ? "admin" : "member"
      }" style="display: flex; align-items: center; position: relative; margin: 10px">
        <span>${isAdmin ? "<b>(Admin)</b> " : ""}${name}</span>
        
        <button class="menu-toggle" data-id="${id}">⋯</button>
        
        <div class="edit-box" id="edit-${id}" style="display: none;">
          ${
            isAdmin
              ? `<button class="rmadminbtn" id="${id}">Remove Admin</button>`
              : `<button class="makeadminbtn" id="${id}">Make Admin</button>`
          }
          <button class="rmuserbtn" id="${id}">Remove User</button>
        </div>
      </li>`;
  });

  document.querySelectorAll(".menu-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const menu = document.getElementById(`edit-${id}`);
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    });
  });
}

function handleMembers(e) {
  let userId = e.target.id;
  let name = e.target.className;
  let token = localStorage.getItem("token");
  let groupID = localStorage.getItem("activeGroup");
  if (name == "makeadminbtn") {
    makeAdmin(userId, token, groupID);
  }
  if (name == "rmadminbtn") {
    removeAdmin(userId, token, groupID);
  }
  if (name == "rmuserbtn") {
    removeUser(userId, token, groupID);
  }
}
async function makeAdmin(userId, token, groupId) {
  try {
    let res = await axios.post(
      `${api}/admin/makeAdmin`,
      { groupId, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.status == 200) {
      fetchAndShowMembers(groupId);
    }
    if (res.status == 403) {
      alert("permission denied");
    }
  } catch (error) {
    console.log(error);
  }
}
async function removeAdmin(userId, token, groupId) {
  try {
    const removeAdminResponse = await axios.post(
      `${api}/admin/removeAdmin`,
      { userId: userId, groupId: groupId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (removeAdminResponse.status == 200) {
      fetchAndShowMembers(groupId);
    }
  } catch (error) {
    console.log(error);
  }
}
async function removeUser(userId, token, groupId) {
  try {
    const removeUserResponse = await axios.post(
      `${api}/admin/removeUser`,
      { userId: userId, groupId: groupId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (removeUserResponse.status == 200) {
      fetchAndShowMembers(groupId);
    }
  } catch (error) {
    console.log(error);
  }
}

async function addGroup(e) {
  try {
    e.preventDefault();
    const groupDetails = {
      name: e.target.group_name.value,
      description: e.target.group_desc.value,
    };
    const token = localStorage.getItem("token");
    const response = await axios.post(`${api}/group/addgroup`, groupDetails, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    if (response.status === 200) {
      alert("Created Group Successfully");
      closePopup(createGroupForm);
      displayGroupOnLoad();
    }
  } catch (error) {
    console.log(error);
    alert("something went wrong!!");
  }
}

async function addMember(e) {
  try {
    e.preventDefault();
    const groupId = localStorage.getItem("activeGroup");
    const newMemberData = {
      email: e.target.email.value,
      groupId: groupId,
    };
    console.log(newMemberData);
    const token = localStorage.getItem("token");
    const response = await axios.post(`${api}/admin/addMember`, newMemberData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      alert("Member Added Successfully");
      closePopup(addMemberForm);
    }
  } catch (error) {
    console.log(error);
    alert("something went wrong!!");
  }
}
