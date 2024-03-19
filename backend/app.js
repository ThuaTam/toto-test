// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const usersRouter = require('./src/routes/users');
const taskRouter = require('./src/routes/tasks');
const  authRouter = require('./src/routes/auth');


// Load biến môi trường từ file .env
dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

app.use(express.json());
// Cấu hình CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Kết nối MongoDB
mongoose.connect(DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});


app.use('/api/users', usersRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/auth', authRouter);


// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
