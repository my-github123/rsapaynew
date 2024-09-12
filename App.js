const express = require("express");
const app=express();
const dotenv = require("dotenv");
const cors = require("cors");
const crypto = require("crypto");

// sudo ss -tulpn | grep LISTEN
// 3306




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
const ipRoutes = require("./src/routes/ipRoutes");



app.use(express.json());

// // Enable CORS for all routes
app.use(cors());

// // Initialize sequelize
sequelize
  .sync()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((e) => {
    console.error("Unable to connect to the database:", e);
  });


  app.get("/api/check-database", async (req, res) => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully for RSA.");
      res.status(200).json({ message: "Database connected successfully for RSA from tvs." });
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      res.status(500).json({ message: "Failed to connect to the database.", error });
    }
  });

// // Routes
// // // User training portal routes
app.use("/rsa-trg", userRoutes);
app.use("/rsa-trg", dashboardRoutes);
app.use("/rsa-trg", videoRoutes);
app.use("/rsa-trg", videoInteraction);
app.use("/rsa-trg", likeRoutes);

// // Decrypt function
function decrypt(key, encrypted) {
  if (!key || !encrypted) {
    throw new Error("Both key and encrypted arguments must be provided and be of type string.");
  }

  const keyBuffer = Buffer.from(key, 'hex');
  const encryptedBuffer = Buffer.from(encrypted, 'base64');
  const ivBuffer = encryptedBuffer.slice(0, 16);
  const ciphertextBuffer = encryptedBuffer.slice(16);
  const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, ivBuffer);

  let decrypted = decipher.update(ciphertextBuffer, null, 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

app.get("/getDecrypt", async (req, res) => {
  const keyAsHexString = 'D8ABA26A5EA3126758F4F9A593BC573B';
  const keyBuffer = Buffer.from(keyAsHexString, 'hex');

  const value = await decrypt(keyBuffer,"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");
  res.send(value);
  console.log(value, "values is there...");
});

app.get("/getRsaProject", async (req, res) => {
 
  res.send("value is coming");
 
});


// // Admin portal routes
app.use("/rsa-trg", adminVideoRoutes);
app.use("/rsa-trg", GCPUploadRoutes);

// RSA admin routes
app.use("/rsa-trg", addUserRoutes);
app.use("/rsa-trg", transactionRoutes);
app.use("/rsa-trg", serviceList);

// RSA user routes
app.use("/rsa-trg", debitRoutes);
app.use("/rsa-trg", debitCreditRoutes);
app.use("/rsa-trg", verifyVPARoute);

app.use("/rsa-trg", ipRoutes);


app.get("/gettingPort",(req,res)=>{
  res.json("4300...")
})

app.get("/",(req,res)=>{
  res.send("4300...")
})


// 192.168.2.8


const PORT = process.env.PORT ||4100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_MTc1ZjY5YjUtMTI3Mi00YTFkLTlhNjktOTU1MzNlNzAzYTVj%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%25222d538e64-36c7-41bc-8b7d-4d804956e957%2522%252c%2522Oid%2522%253a%2522819b505a-7b77-4923-9827-44a5898e05ab%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=54ccd357-02aa-4841-b35a-b910257b8351&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true
//https://teams.microsoft.com/v2/?meetingjoin=true#/l/meetup-join/19:meeting_ZjZkY2Y3ZmQtNDdjZi00N2U3LTk0ZTMtNGI1Mjg2YTNiMDQ3@thread.v2/0?context=%7b%22Tid%22%3a%222d538e64-36c7-41bc-8b7d-4d804956e957%22%2c%22Oid%22%3a%22cf032064-55b4-433b-894f-910ed0f72e62%22%7d&anon=true&deeplinkId=742e31bd-a65d-4677-ba8b-b239a6d11ca3
// https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_MTc1ZjY5YjUtMTI3Mi00YTFkLTlhNjktOTU1MzNlNzAzYTVj%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%25222d538e64-36c7-41bc-8b7d-4d804956e957%2522%252c%2522Oid%2522%253a%2522819b505a-7b77-4923-9827-44a5898e05ab%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=54ccd357-02aa-4841-b35a-b910257b8351&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true


// {"code":"00","result":"SUCCESS","customerName":"ABC","vpa":"917995791961-917@axis"}

