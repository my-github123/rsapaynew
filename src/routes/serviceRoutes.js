const express = require("express");
const router = express.Router();
const serviceListController = require("../controller/serviceListController");

router.post("/createServiceList", serviceListController.createService);
router.get("/getServiceList", serviceListController.getAllServices);

module.exports = router;
