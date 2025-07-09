const express = require("express");
const path = require("path");
const db = require("./utils/db-connection");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const groupRoutes = require("./routes/groupRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();

//models
require("./models");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/group", groupRoutes);
app.use("/admin", adminRoutes);
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "signup.html"));
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});

db.sync({ force: false })
  .then(() => {
    console.log("db synced");
  })
  .catch((err) => {
    console.log(err);
  });

const io = require("socket.io")(server, {
  pingTimeout: 3000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let GroupId;
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("join room", (room) => {
    socket.join(room);
    GroupId = room;
    socket.emit("joined", room);
  });

  socket.on("new message", (message) => {
    io.to(GroupId).emit("message recieved", message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
