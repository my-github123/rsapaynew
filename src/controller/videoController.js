const Post = require("../model/VideoModel");

// exports.createPost = async (req, res) => {
//   try {
//     const {
//       mUserId,
//       mSearchStr,
//       mDateFrom,
//       mDateTo,
//       mDate,
//       mTitle,
//       mDescription,
//       isLiked,
//       mComment,
//     } = req.body;

//     const newPost = await Post.create({
//       mUserId,
//       mSearchStr,
//       mDateFrom,
//       mDateTo,
//       mDate,
//       mTitle,
//       mThumbnailImage: req.file.path, // Save the image file path in the database
//       mDescription,
//       mVideoUrl: req.file.path, // Save the video file path in the database
//       isLiked,
//       mComment,
//     });

//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createPost = async (req, res) => {
  try {
    const { userId, title, description, currentDateTime } = req.body;
    const videoURL = req.file.path; // Use the path of the uploaded file
    const thumbnailImage = req.file.path;

    const newPost = await Post.create({
      userId,
      videoURL,
      thumbnailImage,
      title,
      description,
      currentDateTime,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getVideosByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const videos = await Post.findAll({ where: { userId } });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
