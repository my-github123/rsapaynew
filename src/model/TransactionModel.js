// models/Transaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transaction = sequelize.define("rsa_credit_list", {
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  addAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  expDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transactionTime: {
    type: DataTypes.STRING,
  allowNull: false,
  },
  
}, {
  timestamps: false, // Disable automatic timestamps
});

module.exports = Transaction;
