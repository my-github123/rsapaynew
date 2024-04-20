const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AdminVideo = sequelize.define("AdminVideosList", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  adminUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  VideoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = AdminVideo;
