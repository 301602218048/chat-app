const express = require("express");
const groupController = require("../controllers/groupController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/addgroup", auth.authenticate, groupController.createGroup);
router.get("/getallgroups", auth.authenticate, groupController.getAllGroups);

module.exports = router;
