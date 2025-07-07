const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Message = sequelize.define("messages", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Message;
