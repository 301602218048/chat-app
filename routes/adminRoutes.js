const express = require("express");
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/addmember", auth.authenticate, adminController.addMember);
router.get(
  "/getallmembers/:groupId",
  auth.authenticate,
  adminController.getAllMembers
);

module.exports = router;
