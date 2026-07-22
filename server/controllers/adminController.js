const User = require('../models/User');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Notice = require('../models/Notice');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const studentsCount = await User.countDocuments({ role: 'student' });
    const facultyCount = await User.countDocuments({ role: 'faculty' });
    const departmentsCount = await Department.countDocuments({});
    const subjectsCount = await Subject.countDocuments({});

    res.status(200).json({
      success: true,
      stats: {
        studentsCount,
        facultyCount,
        departmentsCount,
        subjectsCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// DEPARTMENT CRUD
// ==========================================

// @desc    Get all departments
// @route   GET /api/admin/departments
// @access  Private
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, departments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create department
// @route   POST /api/admin/departments
// @access  Private (Admin only)
exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }

    const deptExists = await Department.findOne({ name });
    if (deptExists) {
      return res.status(400).json({ success: false, message: 'Department already exists' });
    }

    const department = await Department.create({ name });
    res.status(201).json({ success: true, department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/admin/departments/:id
// @access  Private (Admin only)
exports.updateDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    department.name = name || department.name;
    await department.save();

    res.status(200).json({ success: true, department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/admin/departments/:id
// @access  Private (Admin only)
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    // Optional safety: check if user/subjects belong to this department
    const usersInDept = await User.findOne({ department: req.params.id });
    if (usersInDept) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete department as it has registered students or faculties associated',
      });
    }

    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// SUBJECT CRUD
// ==========================================

// @desc    Get all subjects
// @route   GET /api/admin/subjects
// @access  Private (Admin only)
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({})
      .populate('department')
      .populate('faculty', 'name email');
    res.status(200).json({ success: true, subjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create subject
// @route   POST /api/admin/subjects
// @access  Private (Admin only)
exports.createSubject = async (req, res) => {
  try {
    const { name, department, semester, faculty } = req.body;
    if (!name || !department || !semester || !faculty) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const subject = await Subject.create({
      name,
      department,
      semester,
      faculty,
    });

    const populatedSubject = await Subject.findById(subject._id)
      .populate('department')
      .populate('faculty', 'name email');

    res.status(201).json({ success: true, subject: populatedSubject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update subject
// @route   PUT /api/admin/subjects/:id
// @access  Private (Admin only)
exports.updateSubject = async (req, res) => {
  try {
    const { name, department, semester, faculty } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    subject.name = name || subject.name;
    subject.department = department || subject.department;
    subject.semester = semester || subject.semester;
    subject.faculty = faculty || subject.faculty;

    await subject.save();
    
    const populatedSubject = await Subject.findById(subject._id)
      .populate('department')
      .populate('faculty', 'name email');

    res.status(200).json({ success: true, subject: populatedSubject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete subject
// @route   DELETE /api/admin/subjects/:id
// @access  Private (Admin only)
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// FACULTY CRUD
// ==========================================

// @desc    Get all faculty users
// @route   GET /api/admin/faculty
// @access  Private (Admin only)
exports.getFaculties = async (req, res) => {
  try {
    const faculties = await User.find({ role: 'faculty' }).populate('department');
    res.status(200).json({ success: true, faculties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create faculty user
// @route   POST /api/admin/faculty
// @access  Private (Admin only)
exports.createFaculty = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password || !department) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const faculty = await User.create({
      name,
      email,
      password,
      role: 'faculty',
      department,
    });

    const populatedFaculty = await User.findById(faculty._id).populate('department');
    res.status(201).json({ success: true, faculty: populatedFaculty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update faculty user
// @route   PUT /api/admin/faculty/:id
// @access  Private (Admin only)
exports.updateFaculty = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    const faculty = await User.findById(req.params.id);

    if (!faculty || faculty.role !== 'faculty') {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    faculty.name = name || faculty.name;
    faculty.email = email || faculty.email;
    faculty.department = department || faculty.department;

    if (password) {
      faculty.password = password; // pre-save hook will hash it
    }

    await faculty.save();
    const populatedFaculty = await User.findById(faculty._id).populate('department');

    res.status(200).json({ success: true, faculty: populatedFaculty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete faculty user
// @route   DELETE /api/admin/faculty/:id
// @access  Private (Admin only)
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await User.findById(req.params.id);
    if (!faculty || faculty.role !== 'faculty') {
      return res.status(404).json({ success: false, message: 'Faculty user not found' });
    }

    // Check if this faculty is assigned to any subject
    const subjectAssigned = await Subject.findOne({ faculty: req.params.id });
    if (subjectAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete faculty as they are currently assigned to subjects.',
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// STUDENT CRUD
// ==========================================

// @desc    Get all student users
// @route   GET /api/admin/students
// @access  Private (Admin only)
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).populate('department');
    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create student user
// @route   POST /api/admin/students
// @access  Private (Admin only)
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, department, semester } = req.body;
    if (!name || !email || !password || !department || !semester) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const student = await User.create({
      name,
      email,
      password,
      role: 'student',
      department,
      semester,
    });

    const populatedStudent = await User.findById(student._id).populate('department');
    res.status(201).json({ success: true, student: populatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student user
// @route   PUT /api/admin/students/:id
// @access  Private (Admin only)
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, password, department, semester } = req.body;
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.department = department || student.department;
    student.semester = semester || student.semester;

    if (password) {
      student.password = password; // pre-save hook will hash it
    }

    await student.save();
    const populatedStudent = await User.findById(student._id).populate('department');

    res.status(200).json({ success: true, student: populatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student user
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin only)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// NOTICE BOARD CRUD
// ==========================================

// @desc    Get all notices
// @route   GET /api/admin/notices
// @access  Private
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({}).sort({ createdAt: -1 }).populate('createdBy', 'name role');
    res.status(200).json({ success: true, notices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create notice
// @route   POST /api/admin/notices
// @access  Private (Admin or Faculty only)
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

    const populatedNotice = await Notice.findById(notice._id).populate('createdBy', 'name role');
    res.status(201).json({ success: true, notice: populatedNotice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update notice
// @route   PUT /api/admin/notices/:id
// @access  Private (Admin or Creator only)
exports.updateNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    // Check auth: user must be Admin or the creator of the notice
    if (req.user.role !== 'admin' && notice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this notice' });
    }

    notice.title = title || notice.title;
    notice.description = description || notice.description;
    await notice.save();

    const populatedNotice = await Notice.findById(notice._id).populate('createdBy', 'name role');
    res.status(200).json({ success: true, notice: populatedNotice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete notice
// @route   DELETE /api/admin/notices/:id
// @access  Private (Admin or Creator only)
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    // Check auth: user must be Admin or the creator of the notice
    if (req.user.role !== 'admin' && notice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this notice' });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


