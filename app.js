const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
