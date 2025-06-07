// config/db.js
const mongoose = require("mongoose");
// require('dotenv').config(); // ไม่จำเป็นต้องเรียกที่นี่ ถ้าเรียกที่ index.js แล้ว

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
