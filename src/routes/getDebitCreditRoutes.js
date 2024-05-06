const express = require("express");
const router = express.Router();
const debitCreditController = require("../controller/debitCreditController");

router.get("/getDebitCredit", debitCreditController.getTransactionData);

module.exports = router;
