const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboardContoller");

router.get("/getDashboard/:userId", dashboardController.getDashboardByUserId);

module.exports = router;
