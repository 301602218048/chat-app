const Group = require("../models/group");
const User = require("../models/user");
const GroupUser = require("../models/groupUser");

const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = req.user;
    const group = await user.createGroup(
      { name, description },
      { through: { isAdmin: true } }
    );
    res
      .status(200)
      .json({ message: "create group success", group, success: true });
  } catch (error) {
    res.status(500).json({ error, success: false });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const user = req.user;
    const groups = await user.getGroups();
    if (!groups || groups.length === 0) {
      return res
        .status(204)
        .json({ message: "No Groups Present", success: true });
    }
    res.status(200).json({
      message: "All Groups Fetched",
      groups,
      success: true,
      username: user.name,
    });
  } catch (error) {
    res.status(500).json({ error, success: "false" });
  }
};

module.exports = {
  createGroup,
  getAllGroups,
};
