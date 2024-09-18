// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const userContoller=require("../controller/userController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/getGarages", userController.getGarageDetails);
router.get("/getUsers", userController.getAllUsers);
router.get("/getRsaUsers",userContoller.getRsaUsers)
router.post("/getUserByRole", userController.loginUserByRole);
router.put("/users/:userId", userController.resetPassword);
router.get("/userExcelExport", userController.userDetailsExport)


// router.post("/mapVideos", userController.mapVideoToGarage);
// router.put('/update', authMiddleware.verifyToken, userController.updateUser);
// router.get('/getuser', authMiddleware.verifyToken, userController.getUserDetails);
// router.delete('/delete/:id', userController.deleteUser);

module.exports = router;
