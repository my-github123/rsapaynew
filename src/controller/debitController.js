const Transaction = require("../model/debitModel");
const addUsers = require("../model/AddUsers");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// const storage = new Storage({
//   keyFilename: path.join(
//     __dirname,
//     "../../prj-stag-gobumpr-service-6567-86059d44965a.json"
//   ),
//   projectId: "prj-stag-gobumpr-service-6567",
// });
// Calculate expiration date one year from now

exports.createTransaction = async (req, res) => {
  try {
    const {
      adminId,
      userId,
      customerName,
      customerMobileNumber,
      ticketNo,
      serviceType,
      upiId,
      remarks,
      transactionId,
      amount,
    } = req.body;

   

  // const image = req.file.path ? req.file.path : null;

    // const bucketName = "bkt-gobumper-stag-02";
    // const destinationFileName = `rsa-images/${req.file.originalname}`;
    // const fileType = req.file.originalname.split(".").pop();

    // let contentType;
    // if (fileType === "mp4") {
    //   contentType = "video/mp4";
    // } else if (fileType === "png") {
    //   contentType = "image/png";
    // } else if (fileType === "jpg" || fileType === "jpeg") {
    //   contentType = "image/jpeg";
    // } else if (fileType === "gif") {
    //   contentType = "image/gif";
    // } else {
    //   // Default to application/octet-stream for unknown types
    //   contentType = "application/octet-stream";
    // }

    // await storage.bucket(bucketName).upload(req.file.path, {
    //   destination: destinationFileName,
    //   contentType,
    // });

    // const oneYearFromNow = new Date();
    // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    // // Generate a signed URL for the uploaded file
    // const [url] = await storage
    //   .bucket(bucketName)
    //   .file(destinationFileName)
    //   .getSignedUrl({ action: "read", expires: oneYearFromNow });

    // // Send the URL as part of the response
    // fs.unlink(req.file.path, (err) => {
    //   if (err) {
    //     console.error("Error deleting file:", err);
    //   }
    // });
    

    const newTransaction = await Transaction.create({
      adminId,
      userId,
      customerName,
      customerMobileNumber,
      ticketNo,
      serviceType,
      upiId,
      remarks,
      amount,
      transactionId,
      image:"url"
     
    });

    const user = await addUsers.findOne({ where: { adminId, userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const updatedAmount = parseFloat(user.amount) - parseFloat(amount);

    await addUsers.update(
      { amount: updatedAmount.toString() },
      { where: { adminId, userId } }
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

exports.deleteAllDebit = async (req, res) => {
  console.log(req.url, ":wfwsdsds");
  try {
    await Transaction.destroy({
      where: {},
      truncate: true,
    });
    res.status(200).json({ message: "All Debit List deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
