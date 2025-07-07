const chatList = document.querySelector(".chatbox-messages");
const newMsg = document.getElementById("new-message");
const api = "http://localhost:3000";
const createGroupBtn = document.getElementById("create-group-btn");
const createGroupForm = document.getElementById("create-group-form");
const username = document.getElementById("current-user");
const addMemberBtn = document.getElementById("add-member");
const addMemberForm = document.getElementById("add-member-form");
const closeButtons = document.querySelectorAll("#close-btn");
const groupList = document.getElementById("group-list");
const memberList = document.getElementById("members-list");
const showMembers = document.getElementById("show-members");

const groupId = localStorage.getItem("activeGroup");

const overlay = document.createElement("div");
overlay.classList.add("popup-overlay");
document.body.appendChild(overlay);

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
    users = JSON.parse(localStorage.getItem("users"));
    username.textContent = users[users.length - 1];
    displayGroupOnLoad();
  } catch (err) {
    console.log(err);
  }
});

async function displayGroupOnLoad() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:3000/group/getallgroups`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    groupList.innerHTML = "";

    const groupName = response.data.groups;
    if (groupName) {
      groupName.forEach((group) => {
        groupList.innerHTML += `
             <li id=${group.id}>${group.name}<button class="del btn-small">X</button></li>
             `;
      });
    }
  } catch (error) {
    console.log(error);
  }
}

groupList.addEventListener("click", (e) => {
  let groupId;
  if (e.target.nodeName == "BUTTON") {
    groupId = e.target.parentElement.id;
    return deleteGroup(groupId);
  }
  if (e.target.nodeName == "LI") {
    groupId = e.target.id;
    localStorage.setItem("activeGroup", `${groupId}`);
    fetchAndShowChat(groupId);
  }
});

async function sendData(e) {
  try {
    e.preventDefault();
    const groupId = localStorage.getItem("activeGroup");
    const newMessage = {
      message: newMsg.value,
      groupId,
    };
    const token = localStorage.getItem("token");
    await axios.post(`${api}/chat/sendmessage`, newMessage, {
      headers: { Authorization: `Bearer ${token}` },
    });
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

    const msgToShow = msg.filter((item) => item.groupId == groupId);
    chatList.innerHTML = "";
    msgToShow.forEach((element) => {
      updateChat(element.message, element.from);
    });
  }
}

showMembers.addEventListener("click", () => fetchAndShowMembers(groupId));

async function fetchAndShowMembers(groupId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:3000/admin/getallmembers/${groupId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    updateMemberList(response.data.members);
  } catch (error) {
    console.log(error);
  }
}

function updateMemberList(members) {
  memberList.innerHTML = "";
  members.forEach((member) => {
    if (member.isAdmin) {
      memberList.innerHTML += `<li class="admin"><b>${member.dataValues.name}(admin)</b>
                    <button class="rmuserbtn" id="${member.dataValues.id}">Remove</button></li>`;
    } else {
      memberList.innerHTML += `<li class="member">${member.dataValues.name}
                    <button class="rmuserbtn" id="${member.dataValues.id}">Remove</button></li>`;
    }
  });
}

async function addGroup(e) {
  try {
    e.preventDefault();
    const groupDetails = {
      name: e.target.group_name.value,
      description: e.target.group_desc.value,
    };
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/group/addgroup",
      groupDetails,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(response);
    if (response.status === 200) {
      alert("Created Group Successfully");
      closePopup(createGroupForm);
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
    const response = await axios.post(
      "http://localhost:3000/admin/addMember",
      newMemberData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 200) {
      alert("Member Added Successfully");
      closePopup(addMemberForm);
    }
  } catch (error) {
    console.log(error);
    alert("something went wrong!!");
  }
}
