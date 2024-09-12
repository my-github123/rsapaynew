const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DebitList = sequelize.define("rsa_debit_list", {
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerMobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ticketNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  upiId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // image: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
});

module.exports = DebitList;
