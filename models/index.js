const User = require("./user");
const Message = require("./message");
const Group = require("./group");
const GroupUser = require("./groupUser");

User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

Group.hasMany(Message);
Message.belongsTo(Group);

module.exports = {
  User,
  Message,
  Group,
  GroupUser,
};
