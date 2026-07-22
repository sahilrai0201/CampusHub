const User = require('../models/User');
const Subject = require('../models/Subject');
const Notes = require('../models/Notes');
const Assignment = require('../models/Assignment');
const Notice = require('../models/Notice');
const fs = require('fs');
const path = require('path');

// @desc    Get Faculty Dashboard Stats
// @route   GET /api/faculty/dashboard
// @access  Private (Faculty only)
exports.getDashboardStats = async (req, res) => {
  try {
    const facultyId = req.user._id;

    // 1. Get subjects assigned to this faculty
    const subjects = await Subject.find({ faculty: facultyId });
    const subjectsCount = subjects.length;

    // 2. Get students in departments and semesters of those subjects
    let studentsCount = 0;
    if (subjectsCount > 0) {
      // Create a query array of department + semester combinations
      const conditions = subjects.map(sub => ({
        role: 'student',
        department: sub.department,
        semester: sub.semester
      }));

      if (conditions.length > 0) {
        studentsCount = await User.countDocuments({
          $or: conditions
        });
      }
    }

    // 3. Count notes uploaded by this faculty
    const notesCount = await Notes.countDocuments({ uploadedBy: facultyId });

    // 4. Count assignments uploaded by this faculty
    const assignmentsCount = await Assignment.countDocuments({ uploadedBy: facultyId });

    res.status(200).json({
      success: true,
      stats: {
        subjectsCount,
        studentsCount,
        notesCount,
        assignmentsCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all subjects assigned to faculty
// @route   GET /api/faculty/subjects
// @access  Private (Faculty only)
exports.getAssignedSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ faculty: req.user._id }).populate('department');
    res.status(200).json({ success: true, subjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get notices list for Faculty
// @route   GET /api/faculty/notices
// @access  Private (Faculty only)
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({}).sort({ createdAt: -1 }).populate('createdBy', 'name');
    res.status(200).json({ success: true, notices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// LECTURE NOTES CONTROLLER
// ==========================================

// @desc    Upload lecture note file
// @route   POST /api/faculty/notes
// @access  Private (Faculty only)
exports.uploadNote = async (req, res) => {
  try {
    const { title, subjectId } = req.body;
    if (!title || !subjectId || !req.file) {
      return res.status(400).json({ success: false, message: 'Title, Subject, and File are required' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const note = await Notes.create({
      title,
      subject: subjectId,
      semester: subject.semester,
      file: `/uploads/notes/${req.file.filename}`,
      uploadedBy: req.user._id,
    });

    const populatedNote = await Notes.findById(note._id).populate('subject');
    res.status(201).json({ success: true, note: populatedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all notes uploaded by faculty
// @route   GET /api/faculty/notes
// @access  Private (Faculty only)
exports.getNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ uploadedBy: req.user._id })
      .populate('subject')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete note file and record
// @route   DELETE /api/faculty/notes/:id
// @access  Private (Faculty only)
exports.deleteNote = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this file' });
    }

    // Delete local file if it exists
    const filePath = path.join(__dirname, '..', note.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Notes.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ASSIGNMENT CONTROLLER
// ==========================================

// @desc    Create new assignment
// @route   POST /api/faculty/assignments
// @access  Private (Faculty only)
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, subjectId, dueDate } = req.body;
    if (!title || !description || !subjectId || !dueDate) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const assignmentData = {
      title,
      description,
      subject: subjectId,
      dueDate: new Date(dueDate),
      uploadedBy: req.user._id,
    };

    if (req.file) {
      assignmentData.file = `/uploads/assignments/${req.file.filename}`;
    }

    const assignment = await Assignment.create(assignmentData);
    const populatedAsn = await Assignment.findById(assignment._id).populate('subject');

    res.status(201).json({ success: true, assignment: populatedAsn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assignments created by faculty
// @route   GET /api/faculty/assignments
// @access  Private (Faculty only)
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ uploadedBy: req.user._id })
      .populate('subject')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/faculty/assignments/:id
// @access  Private (Faculty only)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    if (assignment.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete local file attachment if present
    if (assignment.file) {
      const filePath = path.join(__dirname, '..', assignment.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Assignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get submissions list for a specific assignment
// @route   GET /api/faculty/assignments/:id/submissions
// @access  Private (Faculty only)
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const Submission = require('../models/Submission');
    const submissions = await Submission.find({ assignment: req.params.id })
      .populate('student', 'name email semester department')
      .sort({ submittedAt: -1 });
    res.status(200).json({ success: true, submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Grade student submission marks
// @route   PUT /api/faculty/submissions/:id
// @access  Private (Faculty only)
exports.gradeSubmission = async (req, res) => {
  try {
    const { marks } = req.body;
    if (marks === undefined) {
      return res.status(400).json({ success: false, message: 'Marks are required' });
    }

    const Submission = require('../models/Submission');
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Verify faculty owns this assignment
    const assignment = await Assignment.findById(submission.assignment);
    if (!assignment || assignment.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to grade this submission' });
    }

    submission.marks = marks;
    await submission.save();

    res.status(200).json({ success: true, submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ATTENDANCE MANAGEMENT CONTROLLERS
// ==========================================

// @desc    Get student list matching a subject's department & semester
// @route   GET /api/faculty/subjects/:id/students
// @access  Private (Faculty only)
exports.getSubjectStudents = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const students = await User.find({
      role: 'student',
      department: subject.department,
      semester: subject.semester,
    }).sort({ name: 1 });

    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Post or update attendance records
// @route   POST /api/faculty/attendance
// @access  Private (Faculty only)
exports.submitAttendance = async (req, res) => {
  try {
    const { subjectId, date, records } = req.body; // records: [{ studentId, status }]
    if (!subjectId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Subject ID, Date, and Records array are required' });
    }

    const Attendance = require('../models/Attendance');
    const parsedDate = new Date(date);
    // Set time component to zero to compare dates uniformly
    parsedDate.setHours(0, 0, 0, 0);

    // Delete existing records for this subject and date to prevent duplicates
    await Attendance.deleteMany({
      subject: subjectId,
      date: parsedDate,
    });

    // Create new records
    const attendanceRecords = records.map(rec => ({
      student: rec.studentId,
      subject: subjectId,
      date: parsedDate,
      status: rec.status,
    }));

    await Attendance.insertMany(attendanceRecords);

    res.status(200).json({ success: true, message: 'Attendance recorded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance logs history for faculty's assigned subjects
// @route   GET /api/faculty/attendance
// @access  Private (Faculty only)
exports.getAttendanceHistory = async (req, res) => {
  try {
    const Attendance = require('../models/Attendance');
    const assignedSubjects = await Subject.find({ faculty: req.user._id });
    const subjectIds = assignedSubjects.map(sub => sub._id);

    const history = await Attendance.find({ subject: { $in: subjectIds } })
      .populate('student', 'name email')
      .populate('subject', 'name')
      .sort({ date: -1, 'student.name': 1 });

    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// NOTICES BOARD FOR FACULTY
// ==========================================

// @desc    Create notice
// @route   POST /api/faculty/notices
// @access  Private (Faculty only)
exports.createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const notice = await Notice.create({
      title,
      description,
      createdBy: req.user._id,
    });

    const populatedNotice = await Notice.findById(notice._id).populate('createdBy', 'name');
    res.status(201).json({ success: true, notice: populatedNotice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update notice
// @route   PUT /api/faculty/notices/:id
// @access  Private (Faculty only & Creator check)
exports.updateNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    if (notice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this notice' });
    }

    notice.title = title || notice.title;
    notice.description = description || notice.description;
    await notice.save();

    const populatedNotice = await Notice.findById(notice._id).populate('createdBy', 'name');
    res.status(200).json({ success: true, notice: populatedNotice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete notice
// @route   DELETE /api/faculty/notices/:id
// @access  Private (Faculty only & Creator check)
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    if (notice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this notice' });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};




