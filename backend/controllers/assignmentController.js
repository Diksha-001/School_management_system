const Assignment = require('../models/Assignment');
const Class = require('../models/Class');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private
const createAssignment = async (req, res) => {
  try {
    const { title, description, class: classId, dueDate } = req.body;

    // Check if class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      class: classId,
      teacher: req.user._id,
      dueDate,
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res) => {
  try {
    let assignments;
    if (req.user.role === 'teacher') {
      assignments = await Assignment.find({ teacher: req.user._id })
        .populate('class', 'name')
        .sort({ createdAt: -1 });
    } else {
      // For students, get assignments from their class
      assignments = await Assignment.find({ class: req.user.class })
        .populate('teacher', 'name')
        .sort({ createdAt: -1 });
    }
    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get assignments by class
// @route   GET /api/assignments/class/:classId
// @access  Private
const getAssignmentsByClass = async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.classId })
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    console.error('Get class assignments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentsByClass,
}; 