const Class = require('../models/Class');

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Teacher only)
const createClass = async (req, res) => {
  try {
    const { name, subject, description, schedule } = req.body;

    const newClass = await Class.create({
      name,
      subject,
      description,
      schedule,
      teacher: req.user._id,
      students: [],
    });

    // Populate teacher details before sending response
    const populatedClass = await Class.findById(newClass._id)
      .populate('teacher', 'name')
      .populate('students', 'name');

    res.status(201).json(populatedClass);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get teacher's classes
// @route   GET /api/classes
// @access  Private
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user._id })
      .populate('teacher', 'name')
      .populate('students', 'name')
      .sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createClass, getClasses }; 