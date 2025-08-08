// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Path = require("path");

require("dotenv").config();
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/productRoutes");


const app = express();
// Middleware
app.use(
  cors({
    origin: "*", // or your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err)
    process.exit(1);
  });

  //add global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });
  

  // serve uploaded images publicly
  app.use("/uploads", express.static(Path.join(__dirname, process.env.UPLOADS_FOLDER)));


// Example route
app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
