const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Teachers only)
exports.createAssignment = async (req, res) => {
  try {
    const { title, courseId, description, dueDate } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the teacher of this course
    if (course.teacher.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only add assignments to courses you teach'
      });
    }

    // Create assignment
    const assignment = await Assignment.create({
      title,
      courseId,
      description,
      dueDate,
      createdBy: userId
    });

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is authorized (teacher of the course or enrolled student)
    const isTeacher = course.teacher.toString() === userId;
    const isStudent = course.students.some(
      student => student.toString() === userId
    );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access assignments for this course'
      });
    }

    // Get assignments sorted by due date (upcoming first)
    const assignments = await Assignment.find({ courseId })
      .sort({ dueDate: 1 })
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    console.error('Error getting assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find assignment
    const assignment = await Assignment.findById(id)
      .populate('createdBy', 'name')
      .populate('courseId', 'name');
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if user has access to this course
    const course = await Course.findById(assignment.courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Associated course not found'
      });
    }

    const isTeacher = course.teacher.toString() === userId;
    const isStudent = course.students.some(
      student => student.toString() === userId
    );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this assignment'
      });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error getting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Teachers only)
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const userId = req.user.id;

    // Find assignment
    let assignment = await Assignment.findById(id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if user is the creator of this assignment
    if (assignment.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update assignments you created'
      });
    }

    // Update assignment
    assignment = await Assignment.findByIdAndUpdate(
      id,
      { title, description, dueDate },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Teachers only)
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find assignment
    const assignment = await Assignment.findById(id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if user is the creator of this assignment
    if (assignment.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete assignments you created'
      });
    }

    // Delete assignment
    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};