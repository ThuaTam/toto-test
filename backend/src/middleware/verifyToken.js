const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Lấy token từ header của yêu cầu
  const token = req.headers['authorization'];

  // Kiểm tra xem token có tồn tại hay không
  if (!token) return res.status(401).json({ message: 'Access denied. Token is required.' });

  try {
    // Xác thực token
    const decoded = jwt.verify(token, 'secretkey');

    // Lưu thông tin người dùng từ token vào đối tượng yêu cầu để sử dụng trong các xử lý sau này nếu cần
    req.user = decoded;

    // Tiếp tục xử lý yêu cầu
    next();
  } catch (err) {
    // Trả về lỗi nếu token không hợp lệ
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;