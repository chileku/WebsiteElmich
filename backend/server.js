require("dotenv").config();
const app = require("./src/app");
const sequelize = require("./src/config/database");

const PORT = process.env.PORT || 5000;

// Test kết nối database trước khi chạy server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Kết nối MySQL thành công");

    return sequelize.sync()
  })
  .then(() => {
    console.log("✅ Đồng bộ database thành công");

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối database:", err);
  });
