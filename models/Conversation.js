const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    members: { type: Array, require: true }, // Chứa [ID_User_A, ID_User_B]
}, { timestamps: true }); // Tự động tạo createdAt, updatedAt

module.exports = mongoose.model("Conversation", conversationSchema);