const express = require("express");
const router = express.Router();
const debitController = require("../controller/debitController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/rsaAddDebit",
  upload.single("image"),
  debitController.createTransaction
);

router.get("/rsaGetDebit", debitController.getTransactionByUserAndAdmin);

router.delete("/rsaDeleteAllDebit", debitController.deleteAllDebit);

module.exports = router;
