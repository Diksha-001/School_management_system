const Attendance = require('../models/Attendance');

const markAttendance = async (req, res) => {
  try {
    const { student, subject, date, status } = req.body;
    const attendance = await Attendance.create({
      student,
      subject,
      date,
      status,
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { student, subject } = req.query;
    const query = {};
    if (student) query.student = student;
    if (subject) query.subject = subject;

    const attendance = await Attendance.find(query)
      .populate('student', 'name')
      .populate('subject', 'name');
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { markAttendance, getAttendance }; 