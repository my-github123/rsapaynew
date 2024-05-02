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
// const debitRoutes=require("./s")

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

app.use("/rsa-trg", userRoutes);
app.use("/rsa-trg", dashboardRoutes);
app.use("/rsa-trg", videoRoutes);
app.use("/rsa-trg", videoInteraction);
app.use("/rsa-trg", adminVideoRoutes);
app.use("/rsa-trg", GCPUploadRoutes);
app.use("/rsa-trg", likeRoutes);
app.use("/rsa-trq", addUserRoutes);
app.use("/rsa-trq", transactionRoutes);
app.use("/api/users", transactionRoutes);
app.use("/api/users", addUserRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", serviceList);
// app.use("/api/users", debitRoutes);
// app.use("/api/users", uploadToServer);

const PORT = process.env.PORT || 8100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
