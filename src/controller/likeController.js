const Like = require("../model/Like");
const sequelize = require("../config/db");
const Post = require("../model/VideoModel");
const User = require("../model/VideoModel");

exports.handleLikePost = async (req, res) => {
  try {
    const { userId, username, videoId, count, isActive } = req.body;
    let like;

    if (count === 0) {
      // If count is zero, allow duplicate users
      like = await Like.create({ userId, username, videoId, count, isActive });
    } else {
      // If count is not zero, check if user has already liked the video
      like = await Like.findOne({ where: { userId, videoId } });

      //   if (like) {
      //     // If like entry exists, return a message indicating it was not updated
      //     return res.json({
      //       message: "Like count was not updated. Duplicate user ID.",
      //     });
      //   }

      // If like entry does not exist, create a new entry
      like = await Like.create({ userId, username, videoId, count, isActive });
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

// Controller method to get like counts for all videos
exports.getAllLikeCounts = async (req, res) => {
  try {
    const likeCounts = await Like.findAll({
      attributes: [
        "userId",
        "username",
        "videoId",
        "isActive",
        [sequelize.fn("sum", sequelize.col("count")), "totalLikes"],
      ],
      group: ["userId", "username", "videoId", "isActive"],
    });

    res.json(likeCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller method to get like counts for all videos
// exports.getAllLikeCounts = async (req, res) => {
//   try {
//     const likeCounts = await Like.findAll({
//       attributes: [
//         "videoId",
//         [sequelize.fn("sum", sequelize.col("count")), "totalLikes"],
//       ],
//       group: ["videoId"],
//       include: [
//         {
//           model: User,
//           attributes: ["VideoUrl"],
//           as: "video",
//         },
//       ],
//     });

//     res.json(likeCounts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
