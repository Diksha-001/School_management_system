const express = require('express');
const router = express.Router();
const { protect, teacherOnly } = require('../middleware/authMiddleware');
const { createClass, getClasses } = require('../controllers/classController');

// Apply protect middleware to all routes
router.use(protect);

// Routes that require teacher role
router.post('/', teacherOnly, createClass);
router.get('/', getClasses);

module.exports = router; 