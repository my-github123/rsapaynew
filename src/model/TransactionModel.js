// models/Transaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transaction = sequelize.define("TransactionList", {
  adminID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userID: {
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
});

module.exports = Transaction;
