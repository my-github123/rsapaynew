const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');

dotenv.config();

const sequelize = require("./src/config/db");

const userRoutes = require("./src/routes/userRoutes");
const videoRoutes = require("./src/routes/videoRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const videoInteraction = require("./src/routes/videoInterAction");
const adminVideoRoutes = require("./src/routes/videoAdminRoutes")
const GCPUploadRoutes = require("./src/routes/uploadVideoRoutes")
// const uploadToServer =require("./src/routes/uploadToServer")
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
app.use("/api/users", userRoutes);
app.use("/api/users", dashboardRoutes);
app.use("/api/users", videoRoutes);
app.use("/api/users", videoInteraction);
app.use("/api/users", adminVideoRoutes);
app.use("/api/users", GCPUploadRoutes);
// app.use("/api/users", uploadToServer);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
