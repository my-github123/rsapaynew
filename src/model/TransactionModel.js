// models/Transaction.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transaction = sequelize.define("rsa_credit_list", {
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
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Transaction;
