const api = "http://localhost:3000";
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
    const user = await axios.post(`${api}/user/signup`, obj);
    if (user.data.success) {
      alert(`${user.data.msg}`);
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
