// models/User.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("rsa_users", {
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
  expiry: DataTypes.BOOLEAN,
  phoneNumber: DataTypes.STRING,
  location: DataTypes.STRING,
  flag: {
    type: DataTypes.INTEGER, // Correctly specifying the type
    allowNull: false,
    defaultValue: 0, // Set a default value to avoid NULL
  },
}, {
  timestamps: false, // Disable automatic timestamps
});

module.exports = User;
