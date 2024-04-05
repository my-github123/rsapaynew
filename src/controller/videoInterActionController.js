// controllers/videoInteractionController.js

const VideoInteraction = require("../model/VideoInterAction");

exports.createVideoInteraction = async (req, res) => {
  console.log("calling API for this one");
  try {
    const { userId, videoId, playPressCount, pauseCount, videoSeekBarTime } =
      req.body;
    let existingVideoInteraction = await VideoInteraction.findOne({
      where: { userId, videoId },
    });

    if (existingVideoInteraction) {
      existingVideoInteraction = await existingVideoInteraction.update({
        playPressCount:
          existingVideoInteraction.playPressCount + playPressCount,
        pauseCount: existingVideoInteraction.pauseCount + pauseCount,
        videoSeekBarTime:
          +existingVideoInteraction.videoSeekBarTime + +videoSeekBarTime, // Convert to number and add
      });

      res.status(200).json(existingVideoInteraction);
    } else {
      const videoInteraction = await VideoInteraction.create({
        userId,
        videoId,
        playPressCount,
        pauseCount,
        videoSeekBarTime,
      });
      res.status(201).json(videoInteraction);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// controllers/videoInteractionController.js

exports.deleteVideoInteraction = async (req, res) => {
  try {
    const { userId, videoId } = req.query;
    const deletedCount = await VideoInteraction.destroy({
      where: { userId, videoId },
    });

    if (deletedCount === 1) {
      res
        .status(200)
        .json({ message: "Video interaction deleted successfully" });
    } else {
      res.status(404).json({ error: "Video interaction not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getVideoInteraction = async (req, res) => {
  try {
    const { userId, videoId } = req.query;
    const videoInteraction = await VideoInteraction.findOne({
      where: { userId, videoId },
    });

    if (videoInteraction) {
      res.status(200).json(videoInteraction);
    } else {
      res.status(404).json({ error: "Video interaction not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
