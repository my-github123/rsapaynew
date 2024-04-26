const express = require("express");
const {
  uploadVideoToGCS,
  upload,
} = require("../controller/uploadVideoController"); // Importing both uploadVideoToGCS and upload middleware from uploadVideoController

const router = express.Router();

// POST endpoint for uploading videos to GCS
router.post("/uploadVideoToGcs", upload.single("video"), uploadVideoToGCS);

module.exports = router;
