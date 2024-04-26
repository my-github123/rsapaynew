const Like = require("../model/Like");

exports.handleLikePost = async (req, res) => {
  try {
    const { userId, videoId, count } = req.body;
    let like = await Like.findOne({ where: { userId, videoId } });

    if (like) {
      // If like entry exists, update the count by adding the new count
      like.count += count;
      await like.save();
    } else {
      // If like entry does not exist, create a new entry
      like = await Like.create({ userId, videoId, count });
    }

    res.json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getLikeCount = async (req, res) => {
  try {
    const { userId, videoId } = req.query;
    const like = await Like.findOne({ where: { userId, videoId } });

    if (like) {
      res.json({ count: like.count });
    } else {
      res.json({ count: 0 }); // Return 0 if no like entry found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
  console.log("rahim");
};
