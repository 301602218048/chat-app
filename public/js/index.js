const api = "http://localhost:3000/user";
const msg = document.getElementById("message");

function handleSignUp(e) {
  e.preventDefault();
  const obj = {
    name: e.target.name.value,
    email: e.target.email.value,
    phone: e.target.phone.value,
    password: e.target.password.value,
  };
  addData(obj);
  e.target.reset();
}

async function addData(obj) {
  try {
    const user = await axios.post(`${api}/signup`, obj);
    if (user.data.success) {
      alert(`${user.data.msg}`);
    }
  } catch (error) {
    console.log(error);
    updateDOM(error);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const obj = {
    email: e.target.email.value,
    password: e.target.password.value,
  };
  userLogin(obj);
  e.target.reset();
}

async function userLogin(obj) {
  try {
    const user = await axios.post(`${api}/login`, obj);
    console.log(user);
    if (user.data.success) {
      alert(`${user.data.msg}`);
      localStorage.setItem("token", user.data.token);
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push(user.data.name);
      localStorage.setItem("users", JSON.stringify(users));
      window.location.href = "../html/chat.html";
    }
  } catch (error) {
    console.log(error);
    updateDOM(error);
  }
}

function updateDOM(user) {
  msg.innerHTML = "";
  const para = document.createElement("p");
  para.textContent = `Error: ${user.response.data.msg}`;
  para.style.color = "red";
  msg.appendChild(para);
}
