const Group = require("../models/group");
const User = require("../models/user");
const GroupUser = require("../models/groupUser");

const addMember = async (req, res) => {
  try {
    const { email, groupId } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "email not registered", success: false });
    }
    const alreadyMember = await GroupUser.findOne({
      where: { userId: user.id, groupId: groupId },
    });
    if (alreadyMember) {
      return res
        .status(404)
        .json({ message: "Already a member", success: false });
    }
    const group = await Group.findOne({ where: { id: groupId } });
    await group.addUser(user, {
      through: { isAdmin: false },
    });
    res
      .status(200)
      .json({ message: "added new user to group ", success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const groupId = +req.params.groupId;
    const members = await GroupUser.findAll({ where: { groupId } });
    const membersToSend = [];
    for (let i = 0; i < members.length; i++) {
      const user = await User.findByPk(members[i].userId);
      if (user) {
        const userToSend = {
          ...user,
          isAdmin: members[i].isAdmin,
        };
        membersToSend.push(userToSend);
      }
    }
    res.status(200).json({ members: membersToSend, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch members", success: false });
  }
};

module.exports = {
  addMember,
  getAllMembers,
};
