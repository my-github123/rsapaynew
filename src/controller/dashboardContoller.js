const Dashboard = require("../model/Dashboard");

exports.getDashboardData = async (req, res) => {
  try {
    const dashboardData = await Dashboard.findOne();
    res.json(dashboardData);
    console.log(dashboardData, "Dashboard data is there.");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const dashboard = await Dashboard.findAll({ where: { userId } });
    res.json(dashboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
