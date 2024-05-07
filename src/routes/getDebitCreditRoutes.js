const express = require("express");
const router = express.Router();
const debitCreditController = require("../controller/debitCreditController");

router.get("/rsaGetDebitCredit", debitCreditController.getTransactionData);

module.exports = router;
