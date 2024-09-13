// models/AdminVideo.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AdminVideo = sequelize.define("AdminVideosLists", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  adminUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isEnabled: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: false, // Disable automatic timestamps
});

module.exports = AdminVideo;
