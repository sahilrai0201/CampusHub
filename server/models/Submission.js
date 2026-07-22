const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: [true, 'Assignment reference is required'],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student reference is required'],
  },
  file: {
    type: String,
    required: [true, 'Submission file is required'],
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  marks: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
