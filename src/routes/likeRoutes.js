const express = require("express");
const router = express.Router();
const likeContorllers = require("../controller/likeController");
const Like = require("../model/Like");
const likeContorller = require("../controller/likeController");

router.post("/like", likeContorllers.handleLikePost);
router.get("/getLike", likeContorller.getData);
// Route for the admin to get like counts for all videos
router.get("/admin/like/count", likeContorllers.getAllLikeCounts);

// DELETE all records from the Like table
router.delete("/likes", async (req, res) => {
  try {
    await Like.destroy({
      where: {},
      truncate: true,
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
