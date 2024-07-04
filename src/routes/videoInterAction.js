const express = require("express");
const router = express.Router();
const videoInterActionController = require("../controller/videoInterActionController");

router.post(
  "/videointeraction",
  videoInterActionController.createVideoInteraction
);

router.delete(
  "/videointeraction",
  videoInterActionController.deleteVideoInteraction
);

router.get("/videointeraction", videoInterActionController.getVideoInteraction);

module.exports = router;


