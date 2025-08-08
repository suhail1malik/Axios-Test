exports.uploadProduct = (req, res) => {
  const { title } = req.body;
  const file = req.file;

  if (!title || !file) {
    return res.status(400).json({ message: "Title and image are required" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    file.filename
  }`;

  res.json({
    message: "Product uploaded successfully",
    product: {
      title,
      imageUrl,
    },
  });
};
