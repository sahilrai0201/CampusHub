const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getNotices,
  getNotes,
  getAssignments,
  submitAssignment,
  getAttendanceLogs,
} = require('../controllers/studentController');
const { protect, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protect all routes to Student only
router.use(protect);
router.use(authorizeRoles('student'));

router.get('/dashboard', getDashboardStats);
router.get('/notices', getNotices);

// Notes query route
router.get('/notes', getNotes);

// Assignments queries and submissions
router.get('/assignments', getAssignments);
router.post('/submissions', upload.single('submissionFile'), submitAssignment);

// Attendance query route
router.get('/attendance', getAttendanceLogs);


module.exports = router;
