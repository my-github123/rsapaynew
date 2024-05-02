// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controller/addUserController");

router.post("/addUsers", userController.addUser);

router.delete("/deleteUsers", userController.deleteAllUsers);

// router.get("/getUsers", transactionController.getTransaction);

router.get("/getUsers", userController.getUsers);

module.exports = router;
