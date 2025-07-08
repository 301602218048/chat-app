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

const removeUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const groupId = req.body.groupId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(403)
        .json({ message: "User Not Found", success: false });
    }
    const verifiedAdmin = await GroupUser.findOne({
      where: { userId: req.user.id, isAdmin: true, groupId: groupId },
    });
    if (!verifiedAdmin) {
      return res
        .status(403)
        .json({ message: "you dont have permissions", success: false });
    } else {
      const memberToBeRemoved = await GroupUser.findOne({
        where: { userId: userId, groupId: groupId },
      });
      await memberToBeRemoved.destroy();
      res
        .status(200)
        .json({ message: "user removed from group", success: true });
    }
  } catch (error) {
    res.status(500).json({ message: "remove member failed ", success: false });
  }
};
const makeAdmin = async (req, res) => {
  try {
    let groupId = req.body.groupId;
    let userId = req.body.userId;
    let user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(403)
        .json({ message: "User Not Found", success: false });
    }

    const verifiedAdmin = await GroupUser.findOne({
      where: { userId: req.user.id, isAdmin: true, groupId: groupId },
    });
    if (!verifiedAdmin) {
      return res
        .status(403)
        .json({ message: "you dont have permissions", success: false });
    }
    let memberToBeUpdated = await GroupUser.findOne({
      where: { userId: userId, groupId: groupId },
    });
    await memberToBeUpdated.update({ isAdmin: true });
    res.status(200).json({ message: "user set as admin", success: true });
  } catch (error) {
    res.status(500).json({ message: "fetch member failed ", success: false });
  }
};

const removeAdmin = async (req, res) => {
  try {
    let userId = req.body.userId;
    let groupId = req.body.groupId;

    let user = await User.findByPk(userId);
    if (!user) {
      res.status(403).json({ message: "User Not Found", success: false });
    }
    const verifiedAdmin = await GroupUser.findOne({
      where: { userId: req.user.id, isAdmin: true, groupId: groupId },
    });
    if (!verifiedAdmin) {
      return res
        .status(403)
        .json({ message: "you dont have permissions", success: false });
    }
    let memberToBeUpdated = await GroupUser.findOne({
      where: { userId: userId, groupId: groupId },
    });
    await memberToBeUpdated.update({ isAdmin: false });
    res.status(200).json({ message: "User removed As Admin", success: true });
  } catch (error) {
    res.status(500).json({ message: "remove admin failed", success: false });
  }
};

module.exports = {
  addMember,
  getAllMembers,
  removeAdmin,
  removeUser,
  makeAdmin,
};
