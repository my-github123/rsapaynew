// routes/transactionRoutes.js

const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transactionController");

router.post("/addTransaction", transactionController.addTransaction);

// GET /api/users?adminID=3
router.get("/getTransaction", transactionController.getTransaction);

router.get(
  "/getTranctionAdmin",
  transactionController.getTransactionforAdminID
);

router.get("/getTransactionAll", transactionController.getTransactionList);

router.delete(
  "/deleteTransactionAll",
  transactionController.deleteAllTransaction
);

module.exports = router;
