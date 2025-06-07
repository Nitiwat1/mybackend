require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db");

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "http://localhost:3311" }));
app.use(express.json());

app.get("/test", async (req, res) => {
  res.status(200).json({
    message: "TEST API is working!",
  });
});

const graph = require("./graph/router/router");
app.use("/api/graph", graph);

const Users = require("./login/router/router");
app.use("/api", Users);

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});
