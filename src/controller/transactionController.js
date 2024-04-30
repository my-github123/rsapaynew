// controllers/transactionController.js

const Transaction = require("../model/TransactionModel");
const User = require("../model/AddUsers");

// exports.addTransaction = async (req, res) => {
//   try {
//     const { adminID, userID, addAmount, expDate } = req.body;

//     console.log(req.body, "REQ BBODY IS THERE........");

//     const newTransaction = await Transaction.create({
//       adminID,
//       userID,
//       addAmount,
//       expDate,
//     });

//     res.status(201).json(newTransaction);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.addTransaction = async (req, res) => {
  try {
    const { adminID, userID, addAmount, expDate } = req.body;

    // Add a new transaction
    const newTransaction = await Transaction.create({
      adminID,
      userID,
      addAmount,
      expDate,
    });

    // Update user's amount and expDate
    const user = await User.findOne({ where: { userId: userID } });
    if (user) {
      const updatedUser = await user.update({
        amount: parseInt(user.amount) + parseInt(addAmount),
        expDate,
      });
      console.log("User updated:", updatedUser.toJSON());
    }

    res.status(201).json({ messege: "Added Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTransactionList = async (req, res) => {
  try {
    const users = await Transaction.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionforAdminID = async (req, res) => {
  try {
    const { adminID } = req.query;
    let users;

    if (adminID) {
      users = await Transaction.findAll({
        where: {
          adminId: adminID,
        },
      });
    } else {
      users = await Transaction.findAll();
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const { userID } = req.query;
    let users;

    if (userID) {
      users = await Transaction.findAll({
        where: {
          userId: userID,
        },
      });
    } else {
      users = await Transaction.findAll();
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteAllTransaction = async (req, res) => {
  try {
    await Transaction.destroy({
      where: {},
      truncate: true,
    });
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
