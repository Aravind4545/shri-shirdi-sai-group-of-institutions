const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists in Prod
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|ppt|pptx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || 
                   file.mimetype.includes('officedocument') || 
                   file.mimetype.includes('powerpoint') || 
                   file.mimetype.includes('msword');

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only Images, PDFs, DOCs, and PPTs are allowed!');
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB Limit
  fileFilter
});

module.exports = upload;
