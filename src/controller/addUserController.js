// controllers/userController.js

const User = require("../model/AddUsers");

exports.addUser = async (req, res) => {
  console.log(req.body, "BODY IS THRE..");
  try {
    const {
      userId,
      adminId,
      username,
      password,
      empId,
      phoneNumber,
      location,
    } = req.body;

    const amount = "0";
    const expDate = null;
    const role = "user";
    const isActive = true;
    const expiry=false;

       // Check if the username already exists
       const existingUser = await User.findOne({ where: { empId } });

       if (existingUser) {
         // If the username already exists, send a response to the client
         return res.status(200).json({ message: "EmpId already exists",status:false });
       }

    const newUser = await User.create({
      userId,
      adminId,
      username,
      password,
      empId,
      amount,
      expDate,
      role,
      isActive,
      phoneNumber,
      expiry,
      location,
    });
    res.status(201).json({ messege: "Added Successfully",status:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// controllers/userController.js

// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.status(200).json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// exports.getUsers = async (req, res) => {
//   try {
//     const { adminId } = req.query;
//     let users;

//     if (adminId) {
//       users = await User.findAll({
//         where: {
//           adminId: adminId,
//         },
//       });
//     } else {
//       users = await User.findAll();
//     }

//     res.status(200).json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

exports.getUsers = async (req, res) => {

  try {
    const { adminId } = req.query;
    let users;

    if (adminId) {
      users = await User.findAll({
        where: {
          adminId: adminId,
        },
        order: [["userId", "DESC"]], // Order by userId in descending order
      });
    } else {
      users = await User.findAll({
        order: [["userId", "DESC"]], // Order by userId in descending order
      });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteAllUsers = async (req, res) => {
  try {
    await User.destroy({
      where: {},
      truncate: true,
    });
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.query; // Assuming the userId is passed as a URL parameter

    // Check if userId is provided and valid
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Delete the user with the given userId
    const deletedUser = await User.destroy({
      where: {
        userId: userId, // Only delete the user with the specific userId
      },
    });

    if (deletedUser) {
      res.status(200).json({ message: `User with userId ${userId} deleted successfully` });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

