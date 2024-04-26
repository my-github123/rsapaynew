const express = require("express");
const router = express.Router();
const likeContorllers = require("../controller/likeController");

router.post("/like", likeContorllers.handleLikePost);
router.get("/getLike", likeContorllers.getLikeCount);

module.exports = router;
