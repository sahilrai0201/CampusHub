const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

// Protect all routes to authenticated users
router.use(protect);


// Department lists (Read accessible by faculty/students too, creation admin-only)
router.get('/departments', getDepartments);

// Notice board reading (Commonly readable)
router.get('/notices', getNotices);

// Admin-only Access Zone
router.use(authorizeRoles('admin'));

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// Department management
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// Subject management
router.get('/subjects', getSubjects);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

// Faculty management
router.get('/faculty', getFaculties);
router.post('/faculty', createFaculty);
router.put('/faculty/:id', updateFaculty);
router.delete('/faculty/:id', deleteFaculty);

// Student management
router.get('/students', getStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Notices write operations (Admin)
router.post('/notices', createNotice);
router.put('/notices/:id', updateNotice);
router.delete('/notices/:id', deleteNotice);


module.exports = router;

