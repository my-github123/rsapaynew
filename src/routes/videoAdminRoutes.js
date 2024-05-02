// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const videoAdminController = require("../controller/videoAdminContoller");

router.post(
  "/postVideos",videoAdminController.createAdminPost
);

router.get("/getAdminVideos", videoAdminController.getVideosByAdminId);
router.post("/disableVideo", videoAdminController.disableVideo);

// router.post("/mapVideo",videoController.insertVideosToGarages)

module.exports = router;
