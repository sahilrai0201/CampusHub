const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required'],
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: [true, 'Status is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
