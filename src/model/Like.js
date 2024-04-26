const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Like = sequelize.define("Like", {
  userId: DataTypes.INTEGER,
  videoId: DataTypes.INTEGER,
  count: DataTypes.INTEGER,
});

module.exports = Like;
