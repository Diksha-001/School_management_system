const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createAssignment,
  getAssignments,
  getAssignmentsByClass,
} = require('../controllers/assignmentController');

router.post('/', protect, createAssignment);
router.get('/', protect, getAssignments);
router.get('/class/:classId', protect, getAssignmentsByClass);

module.exports = router; 