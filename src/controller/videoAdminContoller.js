const AdminVideo = require("../model/VideoAdminModel");

exports.createAdminPost = async (req, res) => {
  try {
    const { adminUserId, url, name, description,language, date } = req.body;
    // const videoURL = req.file.path;
    const newPost = await AdminVideo.create({
      adminUserId,
      url,
      name,
      description,
      language,
      date,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// exports.getVideosByAdminId = async (req, res) => {
//   const { adminUserId } = req.params;

//   try {
//     const videos = await AdminVideo.findAll({ where: { adminUserId } });
//     res.json(videos);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.getVideosByAdminId = async (req, res) => {
  try {
    const videos = await AdminVideo.findAll({
      where: { isEnabled: 1 },
      group: ['name', 'url']
    });

    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.disableVideo = async (req, res) => {
  const { videoIds, isEnabled } = req.body;

  try {
    // Update isEnabled to 0 for the selected videos
    for (const videoId of videoIds) {
      const result = await AdminVideo.update(
        { isEnabled: isEnabled },
        { where: { id: videoId } }
      );

      if (result[0] > 0) {
        // Video was updated successfully
        console.log(`Video ${videoId} updated: isEnabled set to ${isEnabled}`);
      } else {
        // No video found with the given ID
        console.log(`No video found with ID ${videoId}`);
      }
    }

    res.status(200).json({ success: true, message: 'Videos deleted successfully' });

  } catch (error) {
    console.error('Error deleting videos:', error);
    res.status(500).json({ success: false, message: 'Failed to delete videos' });
  }
};
