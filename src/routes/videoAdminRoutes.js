// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const videoAdminController = require("../controller/videoAdminContoller");

router.post(
  "/postVideos",videoAdminController.createAdminPost
);

router.post("/getAdminVideos", videoAdminController.getVideosByAdminId);
router.post("/disableVideo", videoAdminController.disableVideo);
router.get("/searchVideos", videoAdminController.searchVideo);
router.get("/getVideosByLang", videoAdminController.getVideosByLang);


// router.post("/mapVideo",videoController.insertVideosToGarages)

module.exports = router;
