const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schema and Model
const DataSchema = new mongoose.Schema({
  key: String,
  value: String,
});

const Data = mongoose.model("Data", DataSchema);

// API to save data
app.post("/api/data", async (req, res) => {
  const { key, value } = req.body;
  try {
    const newData = new Data({ key, value });
    await newData.save();
    res.status(200).json({ message: "Data saved successfully", data: newData });
  } catch (error) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

// API to fetch all data
app.get("/api/data", async (req, res) => {
  try {
    const allData = await Data.find();
    res.status(200).json(allData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// API to check MongoDB server status
app.get("/db-location", async (req, res, next) => {
  try {
    const admin = mongoose.connection.db.admin();
    const serverStatus = await admin.serverStatus();

    res.status(200).json({
      serverStatus: serverStatus,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://3.110.135.201:${port}`);
});
