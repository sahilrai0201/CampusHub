const User = require('../models/User');
const Department = require('../models/Department');
const jwt = require('jsonwebtoken');


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'campushub_jwt_secret_key_123456', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, semester } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Prepare fields, ensuring empty fields are set to undefined
    const userData = {
      name,
      email,
      password,
      role: role || 'student',
    };

    if (userData.role !== 'admin' && department) {
      userData.department = department;
    }
    if (userData.role === 'student' && semester) {
      userData.semester = semester;
    }

    const user = await User.create(userData);

    // Populate department if reference exists
    let populatedUser = user;
    if (user.department) {
      populatedUser = await User.findById(user._id).populate('department');
    }

    res.status(201).json({
      success: true,
      token: signToken(user._id),
      user: {
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        department: populatedUser.department,
        semester: populatedUser.semester,
        profilePhoto: populatedUser.profilePhoto,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user and select password (since select: false is in model)
    const user = await User.findOne({ email }).select('+password').populate('department');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: signToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: user.semester,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('department');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fields that can be updated by user directly
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Check if new photo was uploaded
    if (req.file) {
      user.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    } else if (req.body.profilePhoto !== undefined) {
      user.profilePhoto = req.body.profilePhoto;
    }

    if (user.role === 'student' && req.body.semester) {
      user.semester = req.body.semester;
    }

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('department');

    res.status(200).json({
      success: true,
      user: {
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        department: populatedUser.department,
        semester: populatedUser.semester,
        profilePhoto: populatedUser.profilePhoto,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Update to new password (save pre-hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all departments (Public)
// @route   GET /api/auth/departments
// @access  Public
exports.getDepartmentsPublic = async (req, res) => {
  try {
    const departments = await Department.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, departments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

