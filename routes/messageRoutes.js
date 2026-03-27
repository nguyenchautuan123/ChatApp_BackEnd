const { addMessage, getAllMessage, getConversations} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addMessage/", addMessage);
router.post("/getAllMessages/", getAllMessage);
router.get("/getConversations", getConversations);

module.exports = router;