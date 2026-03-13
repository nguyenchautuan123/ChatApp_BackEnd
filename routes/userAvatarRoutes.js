const router = require("express").Router();
const { setAvatar, searchUsers } = require("../controllers/userController");

//Dịnh nghĩa đường dẫn 
router.post("/setAvatar/:id", setAvatar);
router.get("/search", );

module.exports = router;