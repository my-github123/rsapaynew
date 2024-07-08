const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const sequelize = require("./src/config/db");

const userRoutes = require("./src/routes/userRoutes");
const videoRoutes = require("./src/routes/videoRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const videoInteraction = require("./src/routes/videoInterAction");
const adminVideoRoutes = require("./src/routes/videoAdminRoutes");
const GCPUploadRoutes = require("./src/routes/uploadVideoRoutes");
const uploadToServer = require("./src/routes/uploadVideoRoutes");
const likeRoutes = require("./src/routes/likeRoutes");
const addUserRoutes = require("./src/routes/addUserRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const serviceList = require("./src/routes/serviceRoutes");
const debitRoutes = require("./src/routes/debitRoutes");
const debitCreditRoutes = require("./src/routes/getDebitCreditRoutes");
const verifyVPARoute = require('./src/routes/verifyVPARoutes');


const app = express();

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// sequelize
//   .sync()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((e) => {
//     console.error("Unable to connect to the database:", e);
//   });

// Routes
// user training portal routes
app.use("/rsa-trg", userRoutes);
app.use("/rsa-trg", dashboardRoutes);
app.use("/rsa-trg", videoRoutes);
app.use("/rsa-trg", videoInteraction);
app.use("/rsa-trg", likeRoutes);

//admin portal routes
app.use("/rsa-trg", adminVideoRoutes);
app.use("/rsa-trg", GCPUploadRoutes);

//RSA admin routes
app.use("/rsa-trg", addUserRoutes);
app.use("/rsa-trg", transactionRoutes);
app.use("/rsa-trg", serviceList);

// RSA user routes
app.use("/rsa-trg", debitRoutes);
app.use("/rsa-trg", debitCreditRoutes);
// Use the verifyVPA route for handling /verifyVPA requests
 app.use("/rsa-trg", verifyVPARoute);

const PORT = process.env.PORT || 8100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
