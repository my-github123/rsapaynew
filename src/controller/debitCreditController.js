const Transaction = require("../model/TransactionModel");
const DebitList = require("../model/debitModel");
const GetUsers = require("../model/AddUsers");

exports.getTransactionData = async (req, res) => {
  try {
    const { adminID, userID } = req.query;

    // Validate adminID and userID
    if (isNaN(adminID) || isNaN(userID)) {
      return res.status(400).json({ error: "Invalid adminID or userID" });
    }

    // Fetch data from both models
    const transactions = await Transaction.findAll({
      where: { adminID, userID },
    });

    const userDetails = await GetUsers.findOne({
      where: { adminID, userID },
      attributes: ["amount", "expDate"], // Specify the fields you want to fetch
    });

    const debits = await DebitList.findAll({ where: { adminID, userID } });

    // Format response
    const response = {
      userDetails,
      credit: transactions,
      debit: debits,
    };

    res.json(response);
  } catch (error) {
    console.error("Error from getTransactionData controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};
