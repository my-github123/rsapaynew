const ServiceList = require("../model/ServiceList");

exports.createService = async (req, res) => {
  console.log("is errwe");
  try {
    const { serviceType } = req.body;
    if (!serviceType) {
      return res.status(400).json({ error: "Service type is required" });
    }

    const service = await ServiceList.create({ serviceType });

    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    console.error("Error creating service:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await ServiceList.findAll();

    res.status(200).json({ services });
  } catch (error) {
    console.error("Error fetching services:", error.message);
    res.status(500).json({ error: error.message });
  }
};
