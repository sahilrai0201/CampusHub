const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Notice description is required'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator reference is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
