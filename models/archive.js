const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const ArchiveMsg = sequelize.define("archivemsgs", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true,
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

module.exports = ArchiveMsg;
