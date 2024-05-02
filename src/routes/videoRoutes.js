// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");
const multer = require("multer");

// Multer storage configuration for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1]; // Extract file extension
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  },
});

// Multer storage configuration for videos
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/videos/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1]; // Extract file extension
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  },
});

const uploadImage = multer({ storage: imageStorage }).single("mThumbnailImage");
const uploadVideo = multer({ storage: videoStorage }).single("mVideoUrl");

router.post(
  "/createVideos",
  [uploadImage, uploadVideo],
  videoController.createPost
);

router.get("/getVideos/:userId", videoController.getVideosByUserId);
// router.post("/mapVideo",videoController.insertVideosToGarages)
router.post('/insertVideosToGarages', async (req, res) => {
  try {
    const { selectedGarages, selectedVideos } = req.body;
    const result = await videoController.insertVideosToGarages(selectedGarages, selectedVideos);
    res.json(result);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});
router.post("/disableFlag", videoController.updatedisableFlag);

module.exports = router;
