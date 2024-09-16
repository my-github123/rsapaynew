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

       // Check if the username already exists
       const existingUser = await User.findOne({ where: { empId } });

       if (existingUser) {
         // If the username already exists, send a response to the client
         return res.status(409).json({ message: "EmpId already exists" });
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
      location,
    });
    res.status(201).json({ messege: "Added Successfully" });
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
      //  order: [["createdAt", "DESC"]], // Order by createdAt in descending order
      });
    } else {
      users = await User.findAll({
       // order: [["createdAt", "DESC"]], // Order by createdAt in descending order
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
