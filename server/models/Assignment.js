const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  file: {
    type: String,
    default: '',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
