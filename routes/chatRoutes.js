const express = require("express");
const chatController = require("../controllers/chatController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/sendmessage", auth.authenticate, chatController.postMessage);

module.exports = router;
