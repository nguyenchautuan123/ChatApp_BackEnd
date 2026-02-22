const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); //Cần thiết để tích hợp socket.io
const { Server } = require("socket.io");
require("dotenv").config(); // <--- Thêm dòng này để đọc file .env

const authRouter = require("./routes/auth"); // Import auth routes
const userAvatarRoutes = require("./routes/userAvatarRoutes"); // Import avatar routes

const app = express();
const server = http.createServer(app); // Tạo server bọc lấy app express

// Cấu hình Middleware
app.use(cors());
app.use(express.json()); // Để server đọc được dữ liệu JSON gửi lên
app.use("/api/auth", authRouter);
app.use("/api/userAvatar", userAvatarRoutes);

// Lấy URL từ biến môi trường
const MONGODB_URL = process.env.MONGODB_URL;

// Kết nối MongoDB Atlas
mongoose.connect(MONGODB_URL)
    .then(() => console.log("✅ Đã kết nối thành công tới MongoDB Atlas"))
    .catch((err) => console.error("❌ Lỗi kết nối DB:", err));

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("⚡ Có người vừa kết nối: ", socket.id);
});

// Lấy PORT từ biến môi trường, nếu không có thì dùng 5000
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
});

