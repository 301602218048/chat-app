const express = require("express");
const path = require("path");
const db = require("./utils/db-connection");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/user", userRoutes);
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "signup.html"));
});

const port = process.env.PORT || 3000;
db.sync({ alter: false })
  .then(() => {
    app.listen(port, () => {
      console.log(`server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
