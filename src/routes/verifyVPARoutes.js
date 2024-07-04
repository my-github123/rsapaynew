const express = require('express');
const router = express.Router();
const verifyVPAController = require("../controller/verifyVPAController");
const { transferPayment } = require('../controller/paymentController');
const { getStatus } = require('../controller/statusController');

router.post('/verifyVPA', verifyVPAController.verifyVPA);
router.post('/transfer-payment', transferPayment);
router.post('/get-status', getStatus);

module.exports = router;
