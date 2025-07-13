const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const chatController = require("../controllers/chatController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/sendmessage", auth.authenticate, chatController.postMessage);
router.post(
  "/uploadtos3",
  auth.authenticate,
  upload.single("file"),
  chatController.UploadToS3
);
router.get("/fetchchat/:lastId", auth.authenticate, chatController.fetchChat);

module.exports = router;
