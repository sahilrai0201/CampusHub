const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAssignedSubjects,
  getNotices,
  uploadNote,
  getNotes,
  deleteNote,
  createAssignment,
  getAssignments,
  deleteAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getSubjectStudents,
  submitAttendance,
  getAttendanceHistory,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/facultyController');
const { protect, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protect all routes to Faculty only
router.use(protect);
router.use(authorizeRoles('faculty'));

router.get('/dashboard', getDashboardStats);
router.get('/subjects', getAssignedSubjects);
router.get('/notices', getNotices);

// Notes routes
router.post('/notes', upload.single('noteFile'), uploadNote);
router.get('/notes', getNotes);
router.delete('/notes/:id', deleteNote);

// Assignments routes
router.post('/assignments', upload.single('assignmentFile'), createAssignment);
router.get('/assignments', getAssignments);
router.delete('/assignments/:id', deleteAssignment);
router.get('/assignments/:id/submissions', getAssignmentSubmissions);
router.put('/submissions/:id', gradeSubmission);

// Attendance routes
router.get('/subjects/:id/students', getSubjectStudents);
router.post('/attendance', submitAttendance);
router.get('/attendance', getAttendanceHistory);

// Notices write operations (Faculty)
router.post('/notices', createNotice);
router.put('/notices/:id', updateNotice);
router.delete('/notices/:id', deleteNotice);

module.exports = router;




