const router = require("express").Router();
const { register, login } = require("../controllers/userController"); 

router.post("/register", register); //Đăng ký
router.post("/login", login); //Đăng nhập

module.exports = router;