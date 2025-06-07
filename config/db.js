const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  if (!MONGODB_URI) {
    console.error(
      "❌ MONGODB_URI is not defined in environment variables. Please check your .env file."
    );
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Successfully connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB Atlas connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
