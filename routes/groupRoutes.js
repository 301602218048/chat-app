const express = require("express");
const groupController = require("../controllers/groupController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/addgroup", auth.authenticate, groupController.createGroup);
router.get("/getallgroups", auth.authenticate, groupController.getAllGroups);
router.delete(
  "/deletegroup/:id",
  auth.authenticate,
  groupController.deleteGroup
);

module.exports = router;
