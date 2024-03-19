const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./src/models/user');
const Task = require('./src/models/task');

dotenv.config();
// Kết nối đến cơ sở dữ liệu MongoDB
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
mongoose.connect(DB_CONNECTION_STRING)

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};




const sampleTasks = [
  { title: 'Task 1', description: 'Description of Task 1', status: 'Pending', date: new Date() },
  { title: 'Task 2', description: 'Description of Task 2', status: 'Pending', date: new Date() },
  { title: 'Task 3', description: 'Description of Task 3', status: 'Pending', date: new Date() },
  { title: 'Task 4', description: 'Description of Task 4', status: 'Pending', date: new Date() }
];

// Hàm thêm dữ liệu mẫu vào bảng User và Task
const seedDatabase = async () => {
  try {
    // Xóa hết dữ liệu cũ trong bảng User và Task
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Old data deleted');
    const hashedPassword = await hashPassword('password');

    const sampleUsers = [
      {fullname:'User 1', mobile:"0389721412", username: 'user1', email: 'user1@example.com', password: await hashPassword('password1') },
      {fullname:'User 2', mobile:"0389721412", username: 'user2', email: 'user2@example.com', password: await hashPassword('password2') },
      {fullname:'User 3', mobile:"0389721412", username: 'user3', email: 'user3@example.com', password: await hashPassword('password3') },
      {fullname:'User 4', mobile:"0389721412", username: 'user4', email: 'user4@example.com', password: await hashPassword('password4') },
      {fullname:'User 5', mobile:"0389721412", username: 'user5', email: 'user5@example.com', password: await hashPassword('password5') }
    ];
    // Thêm dữ liệu mới vào bảng User và Task
    for (let i = 0; i < sampleUsers.length; i++) {
      const newUser = await User.create(sampleUsers[i]);
      console.log(`User ${newUser.username} created`);

      for (let j = 0; j < sampleTasks.length; j++) {
        const task = { ...sampleTasks[j], user: newUser._id };
        await Task.create(task);
        console.log(`Task ${j + 1} created for User ${newUser.username}`);
      }
    }

    // Đóng kết nối với cơ sở dữ liệu
    mongoose.connection.close();
    console.log('Connection closed');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

// Gọi hàm seedDatabase để thêm dữ liệu
seedDatabase();
