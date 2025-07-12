const multer = require("multer");
const { uploadMultipleFilesToS3 } = require("../utils/s3");

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files
  },
});

// Middleware to upload files and return URLs
const uploadFiles = upload.array("images", 5);

const uploadAndGetUrls = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      const urls = await uploadMultipleFilesToS3(req.files, "reviews");
      req.uploadedUrls = urls;
    } else {
      req.uploadedUrls = [];
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFiles,
  uploadAndGetUrls,
};
