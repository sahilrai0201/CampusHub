const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required'],
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Faculty is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
