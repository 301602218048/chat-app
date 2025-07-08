const express = require("express");
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/addMember", auth.authenticate, adminController.addMember);
router.get(
  "/getAllMembers/:groupId",
  auth.authenticate,
  adminController.getAllMembers
);
router.post("/makeAdmin", auth.authenticate, adminController.makeAdmin);
router.post("/removeAdmin", auth.authenticate, adminController.removeAdmin);
router.post("/removeUser", auth.authenticate, adminController.removeUser);

module.exports = router;
