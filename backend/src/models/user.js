// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname:{
    type: String,
  },
  mobile:{
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task' // Tham chiếu tới bảng Task
  }],
  name: String,
  dateofbidth: String,

});

module.exports = mongoose.model('User', userSchema);
