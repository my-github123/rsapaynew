const jwt = require("jsonwebtoken");
const User = require("../model/User");
const getUsers = require("../model/AddUsers");
const rsaUsers=require("../model/AddUsers");
// const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const ExcelJS = require('exceljs');
const sequelize = require('../config/db');

exports.registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { username, password } = req.body;

    // Check for required fields
    if (!password || !username) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    let authenticatedUser;

    // Attempt to find the user by username in the User model
    const user = await User.findOne({ where: { username } });

    if (user && user.password === password) {
      authenticatedUser = user;
    } else {
      // If not found in the User model, attempt to find by empId in the getUsers model
      const getUser = await getUsers.findOne({ where: { empId: username } });

      if (getUser && getUser.password === password) {
        authenticatedUser = getUser;
        
      }
    }

    // If no user found, return error
    if (!authenticatedUser) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate a token for the authenticated user
    const token = jwt.sign(
      { userId: authenticatedUser.id },
      "K!M@9556",
      { expiresIn: "1000y" }
    );

    console.log("Login successful");

    // Respond with success message, token, and user info
    res.json({
      message: "Login successful",
      token,
      user: authenticatedUser,
    });
  } catch (error) {
    console.error("Error from userController:", error.message);
    res.status(500).json({ error: error.message });
  }
};



// exports.loginUser = async (req, res) => {

//   try {
//     console.log("Request body:", req.body);

//     const { username, password } = req.body;

//     const user = await User.findOne({ where: { username } });
//      // Find the user by empId in the getUsers model (if you need to use empId, ensure it's provided)
//      const getUser = await getUsers.findOne({ where: { username } });


  

//     let authenticatedUser;

//     if (user && user.password === password) {
//       authenticatedUser = user;
//     } else if (getUser && getUser.password === password) {
//       authenticatedUser = getUser;
//     } else {
//       return res.status(401).json({ error: "Invalid username or password" });
//     }

//     const token = jwt.sign(
//       { userId: authenticatedUser.id },
//       "K!M@9556",
//       {
//         expiresIn: "1000y",
//       }
//     );

//     console.log("Login successful");

//     res.json({
//       message: "Login successful",
//       token,
//       user: authenticatedUser,
//     });
//   } catch (error) {
//     console.error("Error from userController:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.loginUser = async (req, res) => {
//   try {
//     console.log("Request body:", req.body);

//     const { username, password } = req.body;

//     const user = await User.findOne({ where: { username } });
//     const getUser = await getUsers.findOne({ where: { username } });

//     console.log(user.fromApp, "sdsds", user.role, "aas");

//     let authenticatedUser;

//     // if (user.fromApp === "Training portals" && user.role !== "admin") {
//     //   console.log("User is not allowed to login");
//     //   return res.status(403).json({ error: "User not authorized to login" });
//     // }

//     if (user && user.password === password) {
//       authenticatedUser = user;
//     } else if (getUser && getUser.password === password) {
//       authenticatedUser = getUser;
//     } else {
//       return res.status(401).json({ error: "Invalid username or password" });
//     }

//     const token = jwt.sign(
//       { userId: authenticatedUser.id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1000y",
//       }
//     );

//     console.log("Login successful");

//     res.json({ message: "Login successful", token, user: authenticatedUser });
//   } catch (error) {
//     console.error("Error from userController:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.resetPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    console.log(userId, "usernid j s ");

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllUsernames = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["username"] });

    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }

    const usernames = users.map((user) => user.username);
    res.json(usernames);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};


exports.getRsaUsers = async (req, res) => {
  try {
    const users = await rsaUsers.findAll();

    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// exports.updateUser = async (req, res) => {
//   try {
//     const userId = req.user; // Retrieved from the JWT verification middleware
//     const updates = req.body;

//     // If the request includes a password, hash it
//     if (updates.password) {
//       const salt = await bcrypt.genSalt(10);
//       updates.password = await bcrypt.hash(updates.password, salt);
//     }

//     const allowedUpdates = [
//       "firstName",
//       "lastName",
//       "email",
//       "password",
//       "phoneNumber",
//       "country",
//     ];
//     const isValidUpdate = Object.keys(updates).every((update) =>
//       allowedUpdates.includes(update)
//     );

//     if (!isValidUpdate) {
//       return res.status(400).json({ error: "Invalid update fields" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(userId, updates, {
//       new: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user; // Retrieved from the JWT verification middleware

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGarageDetails = async (req, res) => {
  const { garageType } = req.query;
  console.log('Received garageType:', garageType);

  try {
    let garages;
    if (garageType === 'all') {
      garages = await User.findAll({
        where: {
          role: {
            [Sequelize.Op.not]: "Admin",
          },
        },
        group: ["garageName"],
      });
    } else {
      garages = await User.findAll({
        where: { 
          role: {
            [Sequelize.Op.not]: "Admin",
          },
          garageType: garageType
        },
        group: ["garageName"],
      });
    }
    res.json(garages);
  } catch (error) {
    console.error("Error executing Sequelize query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// exports.mapVideoToGarage = async (req, res) => {
//   try {
//     const { selectedGarages, selectedVideos } = req.body;

//     // Iterate over each selected video URL
//     for (const videoUrl of selectedVideos) {
//       // Iterate over each selected garage
//       for (const userId of selectedGarages) {
//         // Update the videoUrl for the selected garage
//         await User.update({ videoUrl }, { where: { userId } });
//       }
//     }

//     res.status(200).json({ message: 'Videos mapped to garages successfully' });
//   } catch (error) {
//     console.error('Error mapping videos to garages:', error);
//     res.status(500).json({ error: 'An error occurred while mapping videos to garages' });
//   }
// };

exports.loginUserByRole = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        username,
        role: "Admin",
      },
    });

    if (!user) {
      console.log("User not found");
      return res
        .status(401)
        .json({ error: "Invalid username or password from user" });
    }

    const passwordMatch = user.password === password;

    console.log(
      username,
      user.password,
      password,
      "PASSWORD IS THERE.............."
    );

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid username or password from password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1000y",
    });
    console.log("Login successful");

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error from userContoller:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.userDetailsExport = async (req, res) => {
  try {
    // const users = await User.findAll({ attributes: ["username","garageName","createdAt","updatedAt"] });
    const users = await sequelize.query(`
    SELECT 
    u.username,
    u.garageName,
    u.createdAt,
    u.updatedAt,
    u.role,
    COUNT(v.videoUrl) AS totalVideos,
    GROUP_CONCAT(v.Title SEPARATOR ', ') AS videoTitles
    FROM
    go_bumpr.users u
    LEFT JOIN
    go_bumpr.VideosLists v ON u.userId = v.userId where u.role!='admin' AND v.isDisabled = 1 
    GROUP BY
    u.username;
    `);
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Add columns
    worksheet.columns = [
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Garage Name', key: 'garageName', width: 30 },
      { header: 'Login Time', key: 'createdAt', width: 30 },
      { header: 'Logout Time', key: 'updatedAt', width: 30 },
      { header: 'Total Videos', key: 'totalVideos', width: 10 },
      { header: 'Video Name', key:'videoTitles', width: 60}
    ];

    users[0].forEach(user => {
      worksheet.addRow({
        username: user.username,
        garageName: user.garageName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        totalVideos: user.totalVideos,
        videoTitles:user.videoTitles
      });
    });

    ['createdAt', 'updatedAt'].forEach(key => {
      worksheet.getColumn(key).numFmt = 'yyyy-mm-dd hh:mm:ss';
    });

    // Write to buffer and send as response
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
    res.send(buffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.logout = async (req, res) => {
  try {
    const { username, userId, role } = req.body;

    // Check if role is 'user'
    if (role === "user") {
      // Find the corresponding entry in rsa_users table
      const rsaUser = await rsaUsers.findOne({
        where: { empId:username, userId }
      });

      if (!rsaUser) {
        return res.status(404).json({ message: "RSA User not found" });
      }

      // Update the flag to 1 in rsa_users table
      await rsaUser.update({ flag: 1 });

      return res.status(200).json({ message: "Logout successful, flag updated in RSA Users table" });
    } else {
      // Find the user in user table
      const user = await User.findOne({where: { username, userId } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the flag to 1 in user table
      await user.update({ flag: 1 });

      return res.status(200).json({ message: "Logout successful, flag updated in User table" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
