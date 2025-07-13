const { validationResult } = require('express-validator');
const emailService = require('../service/emailService');
const { ApiResponse } = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

const sendEmail = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        ApiResponse.badRequest('Validation failed: ' + errors.array().map(err => err.msg).join(', '))
      );
    }

    const { to, subject, text, html, from } = req.body;

    // Validate required fields
    if (!to || !subject) {
      return res.status(400).json(
        ApiResponse.badRequest('Email "to" and "subject" are required fields')
      );
    }

    if (!text && !html) {
      return res.status(400).json(
        ApiResponse.badRequest('Either "text" or "html" content is required')
      );
    }

    // Send email
    const result = await emailService.sendEmail({
      to,
      subject,
      text,
      html,
      from
    });

    res.status(200).json(
      ApiResponse.success(result, 'Email sent successfully')
    );
  } catch (error) {
    next(error);
  }
};

const checkEmailService = async (req, res, next) => {
  try {
    await emailService.verifyConnection();
    
    res.status(200).json(
      ApiResponse.success(
        { 
          status: 'connected',
          service: 'Email Service',
          provider: process.env.EMAIL_HOST
        },
        'Email service is properly configured and connected'
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendEmail,
  checkEmailService
};
