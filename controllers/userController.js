const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Dùng để mã hóa mật khẩu

// Xử lý ĐĂNG KÝ
module.exports.register = async (req, res, next) => {
    try {
        const {username, password, email} = req.body; // Lấy dữ liệu từ Client gửi lên

        // 1. Kiểm tra xem username đã tồn tại chưa
        const usernameCheck = await User.findOne({ username });
        if(usernameCheck){
            return res.json({ msg: "Tên đăng nhập đã tồn tại", status: false});
        }

        // 2. Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Tạo user mới trong Database
        const user = await User.create({
            username,
            password: hashedPassword,
        });

        // 4. Trả kết quả về cho Client (nhưng bỏ mật khẩu đi cho an toàn)
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex); // Nếu lỗi thì chuyển tiếp
    }
};

// Xử lý ĐĂNG NHẬP
module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // 1. Tìm user theo username
        const user = await User.findOne({ username });
        if(!user){
            return res.json({ msg: "Sai tên đăng nhập hoặc mật khẩu", status: false });
        }

        // 2. So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.json({ msg: "Sai tên đăng nhập hoặc mật khẩu", status: false});
        }

        // 3. Xóa mật khẩu trước khi trả về client
        delete user.password;

        // 4. Trả về user nếu đúng
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};