// models/Dashboard.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Dashboard = sequelize.define("dashboardList", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  completed_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unwatched_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  complete_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false, // Disable automatic timestamps
});

module.exports = Dashboard;
