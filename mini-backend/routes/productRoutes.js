const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadProduct } = require("../controllers/productController");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route for uploading
router.post("/products", upload.single("image"), uploadProduct);

module.exports = router;
