const mongoose = require("mongoose");
require("dotenv").config();

// Get connection string from environment variables
const DB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        throw err; // Rethrow to handle in the calling function
    }
};

module.exports = { connectDB };
