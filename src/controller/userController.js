const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, address } = req.body;
    console.log(req.body, "BODY IS THERE....");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

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

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user; // Retrieved from the JWT verification middleware
    const updates = req.body;

    // If the request includes a password, hash it
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "password",
      "phoneNumber",
      "country",
    ];
    const isValidUpdate = Object.keys(updates).every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ error: "Invalid update fields" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
