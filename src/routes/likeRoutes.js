const express = require("express");
const router = express.Router();
const likeContorllers = require("../controller/likeController");

router.post("/like", likeContorllers.handleLikePost);
router.get("/getLike", likeContorllers.getLikeCount);
// Route for the admin to get like counts for all videos
router.get("/admin/like/count", likeContorllers.getAllLikeCounts);

module.exports = router;
