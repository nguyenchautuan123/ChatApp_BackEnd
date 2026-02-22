const router = require("express").Router();
const { setAvatar } = require("../controllers/userController");

//Dịnh nghĩa đường dẫn 
router.post("/setAvatar/:id", setAvatar);

module.exports = router;