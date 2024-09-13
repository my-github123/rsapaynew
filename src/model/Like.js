// models/Like.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Like = sequelize.define("LikeList", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  timestamps: false, // Disable automatic timestamps
});

module.exports = Like;
