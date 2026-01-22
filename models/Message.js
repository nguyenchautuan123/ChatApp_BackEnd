const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversation_Id: { type: String, required: true }, // Thuộc về cuộc trò chuyện nào
    sender: { type: String, required: true }, // Ai gửi (ID User)
    text: { type: String, required: true },  // Nội dung
}, { timestamps: true }); // Tự động tạo createdAt, updatedAt

module.exports = mongoose.model("Message", messageSchema);