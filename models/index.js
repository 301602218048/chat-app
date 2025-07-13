const User = require("./user");
const Message = require("./message");
const Group = require("./group");
const GroupUser = require("./groupUser");
const ArchiveMsg = require("./archive");

User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(ArchiveMsg);
ArchiveMsg.belongsTo(User);

Group.hasMany(ArchiveMsg);
ArchiveMsg.belongsTo(Group);

module.exports = {
  User,
  Message,
  Group,
  GroupUser,
  ArchiveMsg,
};
