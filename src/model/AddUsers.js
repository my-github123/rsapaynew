// models/User.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("adduserList", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  adminId: DataTypes.INTEGER,
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  empId: DataTypes.STRING,
  amount: DataTypes.STRING,
  expDate: DataTypes.DATE,
  role: DataTypes.STRING,
  isActive: DataTypes.BOOLEAN,
  phoneNumber: DataTypes.STRING,
  location: DataTypes.STRING,
});

module.exports = User;
