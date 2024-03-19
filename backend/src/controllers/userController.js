const User = require('../models/user');
const Task = require('../models/task');
const bcrypt = require('bcrypt');
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
    password: hashedPassword
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Tìm tất cả các task của người dùng dựa trên userId
    const tasks = await Task.find({ user: userId });
    console.log(tasks)
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const updateData = req.body; // Dữ liệu cập nhật từ client

  try {
    // Tìm người dùng theo id và cập nhật thông tin
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.json(updatedUser); // Trả về thông tin người dùng đã được cập nhật
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật người dùng" });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.userId; // Lấy id của người dùng từ request params

  try {
    // Tìm người dùng theo id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.json(user); // Trả về thông tin người dùng
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi lấy thông tin người dùng" });
  }
};


const findUserTasks = async (req, res) => {
  const userId = req.params.userId; // Lấy userId từ request params
  const { title, status } = req.query; // Lấy title và status từ query params

  try {
    let query = { user: userId }; // Khởi tạo query với userId của người dùng

    // Nếu có title được cung cấp, thêm điều kiện vào query
    if (title) {
      // Sử dụng biểu thức chính quy để tìm kiếm tiêu đề chứa các ký tự được nhập vào
      query.title = { $regex: new RegExp(title, 'i') };
    }

    // Nếu có status được cung cấp, thêm điều kiện vào query
    if (status && status !== 'All') { // Thêm điều kiện status !== 'All' ở đây
      query.status = status;
    }
    console.log(query)
    // Tìm các task của người dùng dựa trên query
    const tasks = await Task.find(query);

    return res.json(tasks); // Trả về danh sách các task của người dùng
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách các task của người dùng" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserTasks,
  updateUser,
  getUserById,
  findUserTasks
};
