// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controller/addUserController");

router.post("/rsaAddUsers", userController.addUser);

router.delete("/rsaDeleteUsers", userController.deleteAllUsers);

// router.get("/getUsers", transactionController.getTransaction);

router.get("/rsaGetUsers", userController.getUsers);

module.exports = router;
