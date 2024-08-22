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
const ipRoutes=require("./src/routes/ipRoutes")


const app = express();

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

sequelize
  .sync()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((e) => {
    console.error("Unable to connect to the database:", e);
  });

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
app.use("/rsa-trg",verifyVPARoute);


app.use("/rsa-trg",ipRoutes)

const PORT = process.env.PORT || 8100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//https://teams.microsoft.com/v2/?meetingjoin=true#/l/meetup-join/19:meeting_ZjZkY2Y3ZmQtNDdjZi00N2U3LTk0ZTMtNGI1Mjg2YTNiMDQ3@thread.v2/0?context=%7b%22Tid%22%3a%222d538e64-36c7-41bc-8b7d-4d804956e957%22%2c%22Oid%22%3a%22cf032064-55b4-433b-894f-910ed0f72e62%22%7d&anon=true&deeplinkId=742e31bd-a65d-4677-ba8b-b239a6d11ca3
// https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_MTc1ZjY5YjUtMTI3Mi00YTFkLTlhNjktOTU1MzNlNzAzYTVj%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%25222d538e64-36c7-41bc-8b7d-4d804956e957%2522%252c%2522Oid%2522%253a%2522819b505a-7b77-4923-9827-44a5898e05ab%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=54ccd357-02aa-4841-b35a-b910257b8351&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true