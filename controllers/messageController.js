const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

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

        // Mẹo nhỏ: Cập nhật lại thời gian 'updatedAt' của phòng chat
        // Để khi có tin nhắn mới, phòng chat này sẽ được đẩy lên đầu danh sách ở ChatScreen
        await Conversation.findByIdAndUpdate(
            conversation._id, { updatedAt: new Date() }
        );

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
            conversation_Id: conversation._id,
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

//Hàm lấy danh sách cuộc trò chuyện (getConversation)
module.exports.getConversations = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // 1. Tìm tất cả các phòng chat mà có mặt user này
        const conversations = await Conversation.find({
            members: { $in: [userId] }
        }).sort({ updatedAt: -1}); // Sắp xếp: phòng có tin nhắn mới nhất lên đầu (-1)

        // 2. Lấy thông tin chi tiết của từng phòng chat
        const conversationData = await Promise.all(
            conversations.map(async (conv) => {
                const receiverId = conv.members.find((member) => member !== userId);

                const receiver = await User.findById(receiverId).select("username avatarImage");

                const lastMessage = await Message.findOne({ conversation_Id: conv._id}).sort({ createdAt: -1 });

                return {
                    conversation: conv,
                    receiver: receiver,
                    lastMessage: lastMessage ? lastMessage.text : "Chưa có tin nhắn",
                    updatedAt: conv.updatedAt
                };
            })
        );

        res.json({ status: true, data: conversationData});
    } catch (ex) {
        next(ex); 
    }
};