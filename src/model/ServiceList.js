// models/ServiceList.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ServiceList = sequelize.define("rsa_service_list", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false, // Disable automatic timestamps
});

module.exports = ServiceList;
