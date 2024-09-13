// models/videoInteraction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const VideoInteraction = sequelize.define("videointeraction", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  playPressCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pauseCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  videoSeekBarTime: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: false, // Disable automatic timestamps
});

module.exports = VideoInteraction;
