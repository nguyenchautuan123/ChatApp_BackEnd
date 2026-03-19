const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Hàm gửi tin nhắn
module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        // 1. Kiểm tra xem 2 người này đã có "Phòng chat" (Conversation) nào chưa?
        let conversation = await Conversation.findOne({
            members: {$all: [from, to] },
        });

        // 2. Nếu chưa từng chat (chưa có phòng), thì tạo một phòng chat mới
        if(!conversation){
            conversation = await Conversation.create({
                members: [from, to],
            });
        }

        // 3. Tạo tin nhắn mới và nhét nó vào cái phòng chat đó
        const newMessage = await Message.create({
            conversation_Id: conversation._id,
            sender: from,
            text: message,
        });

        if(newMessage){
            return res.json({ message: "Tin nhắn đã được gửi.", data: newMessage});
        } else {
            return res.json({ message: "Lỗi ghi tin nhắn vào cơ sở dữ liệu" });
        }
    } catch (ex) {
        next(ex);
    }
};

// Hàm lấy lịch sử tin nhắn
module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        // 1. Tìm "Phòng chat" của 2 người này
        const conversation = await Conversation.findOne({
            members: { $all: [from, to] },
        });

        // Nếu chưa từng chat thì danh sách tin nhắn là rỗng
        if(!conversation){
            return res.json([]);
        }

        // 2. Lấy toàn bộ tin nhắn thuộc về phòng chat này
        const messages = await Message.find({
            conversationId: conversation._id,
        }).sort({ createdAt: 1}); // Sắp xếp theo thời gian cũ -> mới (dùng createdAt)

        const projectedMessages = messages.map((msg) => {
            return {
                id: msg._id,
                fromSelf: msg.sender.toString() === from,
                message: msg.text,
            };
        });

        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};