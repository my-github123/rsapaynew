const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Post = sequelize.define("VideosList", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  TumbNailImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  VideoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isLiked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  Comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  commentCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  likeCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Date: {
    // Add this line to define the Date column
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Post;
