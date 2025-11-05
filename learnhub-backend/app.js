const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { sequelize } = require('./src/models'); // Import sequelize instance
const authRoutes = require('./src/api/v1/auth.route'); // Import auth routes

// Middleware
app.use(cors()); // Cho phép CORS để frontend truy cập
app.use(express.json()); // Parse JSON body

// Routes
app.use('/auth', authRoutes); // Sử dụng route cho đăng nhập/đăng ký
app.use('/api/v1', require('./src/api/v1')); // Giữ route khác nếu có

const PORT = process.env.PORT || 8080;

// Hàm để khởi động server
const startServer = async () => {
  try {
    // Bước 1: Kiểm tra kết nối database
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công qua Sequelize!');

    // Bước 2: Đồng bộ (migrate) database với model
    await sequelize.sync({ alter: true }); // { alter: true } để cập nhật bảng mà không mất dữ liệu
    console.log('✅ Đã đồng bộ (Migrate) CSDL và Model thành công.');

    // Khởi động server sau khi kết nối và đồng bộ DB thành công
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    // Cập nhật thông báo lỗi chi tiết hơn
    console.error('❌ Lỗi kết nối hoặc đồng bộ CSDL:', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1); // Thoát tiến trình nếu lỗi
  }
};

// Gọi hàm để khởi động server
startServer();