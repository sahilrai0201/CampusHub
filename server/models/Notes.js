const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required'],
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
  },
  file: {
    type: String,
    required: [true, 'File path is required'],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Notes', notesSchema);
