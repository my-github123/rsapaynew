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

  const value = await decrypt(keyBuffer,"Op426SfBdmMyvbpB9UkTaEI3+pm4Jcqz1PR/IIzpV8qNx78mXF2lEVxFNCgq2NFGuvRyFjvXRsPJCq3pVRiHIINMY3odEXDcmZ+gY80pCfXqiQ+KkKjuWvsHtKR9m+X0rRbFMRSkGDN3P9GtfcdcTQ==")
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
app.use("/uat/rsa-trg", serviceList);

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

