const express = require("express");
const router = express.Router();
const serviceListController = require("../controller/serviceListController");

router.post("/rsaCreateServiceList", serviceListController.createService);
 router.get("/rsaGetServiceList", serviceListController.getAllServices);
router.delete("/rsaDeleteServiceAll", serviceListController.deleteAllServices);

module.exports = router;
