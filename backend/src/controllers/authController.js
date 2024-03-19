const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Controller xử lý yêu cầu đăng nhập
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm user trong cơ sở dữ liệu bằng email
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // So sánh mật khẩu
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Tạo và gửi token
    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = (req, res) => {
  // Tạo một phiên bản mới của token với thời gian hết hạn gần như là ngay lập tức (ví dụ: 1 giây sau)
  const expiredToken = jwt.sign({}, 'your_secret_key', { expiresIn: '1s' });

  // Xóa token từ cookie bằng cách gửi một phiên bản của token đã hết hạn
  res.cookie('token', expiredToken, { maxAge: 0 }); // Thời gian sống của token: 0 (sẽ hết hạn ngay lập tức)

  res.json({ message: 'Logout successful' });
};


module.exports = {
  login,
  logout
};
