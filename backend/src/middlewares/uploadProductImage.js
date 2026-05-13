const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { productId } = req.params;

    // Tạo đường dẫn: uploads/product/{productId}
    const uploadPath = path.join(
      __dirname,
      "../../uploads/product",
      productId.toString(),
    );

    // Nếu chưa tồn tại thì tạo folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

module.exports = multer({ storage });
