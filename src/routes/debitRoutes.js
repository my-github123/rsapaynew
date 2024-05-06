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
  "/addDebit",
  upload.single("image"),
  debitController.createTransaction
);

router.get("/getDebit", debitController.getTransactionByUserAndAdmin);

module.exports = router;
