const Transaction = require("../model/TransactionModel");
const DebitList = require("../model/debitModel");
const GetUsers = require("../model/AddUsers");

exports.getTransactionData = async (req, res) => {
  try {
    const { adminId, userId } = req.query;

    // Validate adminID and userID
    if (isNaN(adminId) || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid adminID or userID" });
    }

    // Fetch data from both models
    const transactions = await Transaction.findAll({
      where: { adminId, userId },
      order: [["id", "DESC"]], // Order transactions by transactionTime in descending order
    });

    const userDetails = await GetUsers.findOne({
      where: { adminId, userId },
      attributes: ["amount", "expDate","expiry"], // Specify the fields you want to fetch
    //  order: [["userId", "DESC"]], // Fetch userDetails with descending userId order
    });

    const debits = await DebitList.findAll({ where: { adminId, userId },
      order: [["id", "DESC"]], // Order debits by userId in descending order
     });

   const currentDate = new Date();

// Check if userDetails and expDate exist
if (userDetails && userDetails.expDate) {
  const expiryDate = new Date(userDetails.expDate); // Convert expDate to a Date object

  // If the exp date is greater than currentDate, update the amount to 0
  if (currentDate <expiryDate) {
    userDetails.amount = 0;
    userDetails.expiry=true;
  }
}

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
