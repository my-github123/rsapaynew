// routes/transactionRoutes.js

const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transactionController");

router.post("/rsaAddTransaction", transactionController.addTransaction);

// GET /api/users?adminID=3
router.get("/rsaGetTransaction", transactionController.getTransaction);

router.get(
  "/rsaGetTranctionAdmin",
  transactionController.getTransactionforAdminID
);

router.get("/rsaGetTransactionAll", transactionController.getTransactionList);

router.delete(
  "/rsaDeleteTransactionAll",
  transactionController.deleteAllTransaction
);

module.exports = router;
