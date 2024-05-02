const AdminVideo = require("../model/VideoAdminModel");
const { Op } = require('sequelize');

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
    const { language } = req.body;

    let videos;
    if (language) {
      videos = await AdminVideo.findAll({
        where: {
          isEnabled: 1,
          language: language
        },
        group: ['name', 'url']
      });
    } else {
      videos = await AdminVideo.findAll({
        where: { isEnabled: 1 },
        group: ['name', 'url']
      });
    }

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

exports.searchVideo = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    const results = await AdminVideo.findAll({
      where: {
        [Op.and]: [
          { isEnabled: 1 },
          {
            [Op.or]: [
              { name: { [Op.like]: `%${searchTerm}%` } },
            ]
          }
        ]
      },
      group: ['name', 'url']
    });

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getVideosByLang = async (req, res) => {
  try {
    const { language } = req.body;

    if (!language) {
      return res.status(400).json({ message: 'Language is required in the request body' });
    }

    const videos = await AdminVideo.findAll({
      where: {
        isEnabled: 1,
        language: language
      },
      group: ['name', 'url']
    });

    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};