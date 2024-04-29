const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Like = sequelize.define("likeLists", {
  userId: DataTypes.INTEGER,
  username: DataTypes.STRING,
  videoId: DataTypes.INTEGER,
  count: DataTypes.INTEGER,
  isActive: DataTypes.BOOLEAN,
});

module.exports = Like;
