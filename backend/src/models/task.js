const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status:{
    type: String,
    required: true,
    enum: ['Pending', 'Done']
  },
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Tham chiếu tới bảng User
  }
});

module.exports = mongoose.model('Task', taskSchema);