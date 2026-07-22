const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload folders exist
const uploadDirs = [
  'uploads/',
  'uploads/profiles/',
  'uploads/notes/',
  'uploads/assignments/',
  'uploads/submissions/'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Configure Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/';
    
    // Choose destination folder based on fieldname or route
    if (file.fieldname === 'profilePhoto') {
      folder += 'profiles/';
    } else if (file.fieldname === 'noteFile' || file.fieldname === 'file' && req.baseUrl.includes('notes')) {
      folder += 'notes/';
    } else if (file.fieldname === 'assignmentFile' || file.fieldname === 'file' && req.baseUrl.includes('assignments')) {
      folder += 'assignments/';
    } else if (file.fieldname === 'submissionFile' || file.fieldname === 'file' && req.baseUrl.includes('submissions')) {
      folder += 'submissions/';
    }
    
    cb(null, path.join(__dirname, '..', folder));
  },
  filename: function (req, file, cb) {
    // Remove spaces from original filename to avoid URL matching issues
    const cleanFileName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${cleanFileName}`);
  }
});

// File filter (e.g. PDF/Docs/Images)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profilePhoto') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed for profile pictures'), false);
    }
  } else {
    // For other files, we allow PDFs, common Office documents, and images
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

module.exports = upload;
