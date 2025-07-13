const express = require('express');
const { body } = require('express-validator');
const { sendEmail, checkEmailService } = require('../controller/emailController');

const router = express.Router();

// Validation middleware for email sending
const emailValidation = [
  body('to')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters'),
  body('from')
    .optional()
    .isEmail()
    .withMessage('From must be a valid email address')
    .normalizeEmail(),
  body('text')
    .optional()
    .isLength({ max: 10000 })
    .withMessage('Text content must be less than 10000 characters'),
  body('html')
    .optional()
    .isLength({ max: 50000 })
    .withMessage('HTML content must be less than 50000 characters')
];

// Routes
router.post('/sendemail', emailValidation, sendEmail);
router.get('/check', checkEmailService);

module.exports = router;
