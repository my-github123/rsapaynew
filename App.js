const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = require("./src/config/db");

// const userRoutes = require("./src/routes/userRoutes");
// const videoRoutes = require("./src/routes/videoRoutes");
// const dashboardRoutes = require("./src/routes/dashboardRoutes");
// const videoInteraction = require("./src/routes/videoInterAction");

const app = express();

app.use(express.json());

sequelize
  .sync()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((e) => {
    console.error("Unable to connect to the database:", e);
  });
console.log("Rajom");
// Routes
// app.use("/api/users", userRoutes);
// app.use("/api/users", dashboardRoutes);
// app.use("/api/users", videoRoutes);
// app.use("/api/users", videoInteraction);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
