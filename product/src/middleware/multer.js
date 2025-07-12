const multer = require("multer");

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only image files are allowed!"));
  }
};

// Memory storage configuration
const storage = multer.memoryStorage();

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10, // Maximum 10 files
  },
});

// Multiple file upload middleware (handles both single and multiple)
const uploadFiles = upload.array("images", 10);

module.exports = {
  uploadFiles,
};
