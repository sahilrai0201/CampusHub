const User = require('../models/User');
const Subject = require('../models/Subject');
const Notes = require('../models/Notes');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Attendance = require('../models/Attendance');
const Notice = require('../models/Notice');

// @desc    Get Student Dashboard Stats
// @route   GET /api/student/dashboard
// @access  Private (Student only)
exports.getDashboardStats = async (req, res) => {
  try {
    const studentId = req.user._id;
    const department = req.user.department;
    const semester = req.user.semester;

    if (!department || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Student department and semester not configured. Please contact the administrator.',
      });
    }

    // 1. Calculate Attendance Percentage
    const totalClasses = await Attendance.countDocuments({ student: studentId });
    const presentClasses = await Attendance.countDocuments({ student: studentId, status: 'Present' });
    const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : null;

    // 2. Fetch Subjects in this student's department & semester
    const subjects = await Subject.find({ department, semester });
    const subjectIds = subjects.map(sub => sub._id);

    // 3. Count notes available for this department and semester
    const totalNotes = await Notes.countDocuments({ subject: { $in: subjectIds } });

    // 4. Calculate Pending and Submitted Assignments
    // Get all assignments for these subjects
    const assignments = await Assignment.find({ subject: { $in: subjectIds } });
    const assignmentIds = assignments.map(asn => asn._id);

    // Get student's submissions for these assignments
    const submissions = await Submission.find({
      student: studentId,
      assignment: { $in: assignmentIds },
    });
    const submittedAssignmentIds = submissions.map(sub => sub.assignment.toString());

    const submittedAssignments = submissions.length;
    const pendingAssignments = assignmentIds.filter(id => !submittedAssignmentIds.includes(id.toString())).length;

    res.status(200).json({
      success: true,
      stats: {
        attendancePercentage,
        pendingAssignments,
        submittedAssignments,
        totalNotes,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get notices list for Student
// @route   GET /api/student/notices
// @access  Private (Student only)
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
// NOTES CONTROLLER FOR STUDENTS
// ==========================================

// @desc    Get study notes matching student department & semester
// @route   GET /api/student/notes
// @access  Private (Student only)
exports.getNotes = async (req, res) => {
  try {
    const department = req.user.department;
    const semester = req.user.semester;

    // Get subjects in student's dept & sem
    const subjects = await Subject.find({ department, semester });
    const subjectIds = subjects.map(sub => sub._id);

    const notes = await Notes.find({ subject: { $in: subjectIds } })
      .populate('subject')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ASSIGNMENT CONTROLLER FOR STUDENTS
// ==========================================

// @desc    Get assignments list along with student submissions status
// @route   GET /api/student/assignments
// @access  Private (Student only)
exports.getAssignments = async (req, res) => {
  try {
    const department = req.user.department;
    const semester = req.user.semester;

    // Get subjects in student's dept & sem
    const subjects = await Subject.find({ department, semester });
    const subjectIds = subjects.map(sub => sub._id);

    // Get assignments for these subjects
    const assignments = await Assignment.find({ subject: { $in: subjectIds } })
      .populate('subject')
      .populate('uploadedBy', 'name email')
      .sort({ dueDate: 1 });

    // Join with student submissions
    const enrichedAssignments = [];
    for (const asn of assignments) {
      const submission = await Submission.findOne({
        student: req.user._id,
        assignment: asn._id,
      });

      enrichedAssignments.push({
        _id: asn._id,
        title: asn.title,
        description: asn.description,
        subject: asn.subject,
        dueDate: asn.dueDate,
        file: asn.file,
        uploadedBy: asn.uploadedBy,
        createdAt: asn.createdAt,
        submission: submission || null,
      });
    }

    res.status(200).json({ success: true, assignments: enrichedAssignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit homework assignment
// @route   POST /api/student/submissions
// @access  Private (Student only)
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    if (!assignmentId || !req.file) {
      return res.status(400).json({ success: false, message: 'Assignment ID and File are required' });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Verify student hasn't already submitted
    const existingSubmission = await Submission.findOne({
      student: req.user._id,
      assignment: assignmentId,
    });
    if (existingSubmission) {
      return res.status(400).json({ success: false, message: 'Assignment already submitted' });
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      file: `/uploads/submissions/${req.file.filename}`,
    });

    res.status(201).json({ success: true, submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance records for logged in student
// @route   GET /api/student/attendance
// @access  Private (Student only)
exports.getAttendanceLogs = async (req, res) => {
  try {
    const studentId = req.user._id;
    const Attendance = require('../models/Attendance');

    const logs = await Attendance.find({ student: studentId })
      .populate('subject', 'name')
      .sort({ date: -1 });

    // Compile subject-wise logs metrics
    const subjects = await Subject.find({ department: req.user.department, semester: req.user.semester });
    
    const subjectWiseStats = [];
    for (const sub of subjects) {
      const total = await Attendance.countDocuments({ student: studentId, subject: sub._id });
      const present = await Attendance.countDocuments({ student: studentId, subject: sub._id, status: 'Present' });
      const percent = total > 0 ? (present / total) * 100 : null;

      subjectWiseStats.push({
        subjectName: sub.name,
        totalClasses: total,
        presentClasses: present,
        percentage: percent,
      });
    }

    res.status(200).json({
      success: true,
      logs,
      stats: subjectWiseStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


