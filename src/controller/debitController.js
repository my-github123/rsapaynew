const Transaction = require("../model/debitModel");
const addUsers = require("../model/AddUsers");

exports.createTransaction = async (req, res) => {
  console.log(req.body, "REQ IS BODY IS THERE");
  try {
    const {
      adminID,
      userID,
      customerName,
      customerMobileNumber,
      ticketNo,
      serviceType,
      upiId,
      remarks,
      transactionId,
      amount,
    } = req.body;
    const image = req.file.path; // Multer will add a 'file' property to the request object

    const newTransaction = await Transaction.create({
      adminID,
      userID,
      customerName,
      customerMobileNumber,
      ticketNo,
      serviceType,
      upiId,
      remarks,
      amount,
      transactionId,
      image,
    });

    const user = await addUsers.findOne({ where: { adminID, userID } });
    if (!user) {
      throw new Error("User not found");
    }

    const updatedAmount = parseFloat(user.amount) - parseFloat(amount);

    await addUsers.update(
      { amount: updatedAmount.toString() },
      { where: { adminID, userID } }
    );

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactionByUserAndAdmin = async (req, res) => {
  console.log(req.url, ":wfwsdsds");
  try {
    const { adminID, userID } = req.query;

    const transactions = await Transaction.findAll({
      where: {
        userID,
        adminID,
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
