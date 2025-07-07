const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const GroupUser = sequelize.define(
  "groupusers",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = GroupUser;
