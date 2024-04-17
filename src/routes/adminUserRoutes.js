//routes/adminUserRoutes.js
const express = require("express");
const router = express.Router();
const adminUserController = require("../controller/adminUserController");
const authMiddleware = require("../middleware/authMiddleware");

// router.post("/register", userController.registerUser);
router.post("/loginAdminUser", adminUserController.loginAdminUser);
router.get("/getAllAdminUsers", adminUserController.getAllAdminUsers);
// router.post("/mapVideos", userController.mapVideoToGarage);
// router.put('/update', authMiddleware.verifyToken, userController.updateUser);
// router.get('/getuser', authMiddleware.verifyToken, userController.getUserDetails);
// router.delete('/delete/:id', userController.deleteUser);

module.exports = router;