const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Teacher only)
exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    
    // Verify user is a teacher
    const teacher = await User.findById(userId);
    
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Only teachers can create courses'
      });
    }
    
    // Create course
    const course = await Course.create({
      name,
      description,
      teacherId: teacher.teacherId,
      teacher: userId,
      students: [],
      studentsRollNumbers: []
    });
    
    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all courses for a teacher
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    let courses;
    
    if (user.role === 'teacher') {
      // Get all courses created by this teacher
      courses = await Course.find({ teacher: userId })
        .populate('teacher', 'name email')
        .populate('students', 'name email rollNumber');
    } else if (user.role === 'student') {
      // Get all courses this student is enrolled in
      courses = await Course.find({ students: userId })
        .populate('teacher', 'name email teacherId')
        .populate('students', 'name email rollNumber');
    } else {
      return res.status(403).json({
        success: false,
        message: 'Invalid user role'
      });
    }
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get a single course
// @route   GET /api/courses/:id
// @access  Private
exports.getCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    
    const course = await Course.findById(courseId)
      .populate('teacher', 'name email teacherId')
      .populate('students', 'name email rollNumber');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is teacher of this course or enrolled student
    const isTeacher = course.teacher._id.toString() === userId;
    const isStudent = course.students.some(student => student._id.toString() === userId);
    
    if (!isTeacher && !isStudent) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this course'
      });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error getting course:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Teacher only)
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { name, description } = req.body;
    const userId = req.user.id;
    
    // Find course
    let course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is the course teacher
    if (course.teacher.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update courses you created'
      });
    }
    
    // Update course
    course = await Course.findByIdAndUpdate(
      courseId,
      { name, description },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher only)
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    
    // Find course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is the course teacher
    if (course.teacher.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete courses you created'
      });
    }
    
    await course.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add student to course
// @route   POST /api/courses/:id/students
// @access  Private (Teacher only)
exports.addStudent = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { rollNumber } = req.body;
    const userId = req.user.id;
    
    // Find course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is the course teacher
    if (course.teacher.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only add students to courses you created'
      });
    }
    
    // Find student by roll number
    const student = await User.findOne({ rollNumber, role: 'student' });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found with this roll number'
      });
    }
    
    // Check if student is already in the course
    if (course.students.includes(student._id)) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course'
      });
    }
    
    // Add student to course
    course.students.push(student._id);
    course.studentsRollNumbers.push(rollNumber);
    await course.save();
    
    // Return the updated course with populated student data
    const updatedCourse = await Course.findById(courseId)
      .populate('teacher', 'name email')
      .populate('students', 'name email rollNumber');
    
    res.status(200).json({
      success: true,
      data: updatedCourse
    });
  } catch (error) {
    console.error('Error adding student to course:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove student from course
// @route   DELETE /api/courses/:id/students/:studentId
// @access  Private (Teacher only)
exports.removeStudent = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.params.studentId;
    const userId = req.user.id;
    
    // Find course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is the course teacher
    if (course.teacher.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only remove students from courses you created'
      });
    }
    
    // Find student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Remove student from course
    course.students = course.students.filter(
      student => student.toString() !== studentId
    );
    
    // Remove student's roll number from the course
    course.studentsRollNumbers = course.studentsRollNumbers.filter(
      rollNum => rollNum !== student.rollNumber
    );
    
    await course.save();
    
    // Return the updated course with populated student data
    const updatedCourse = await Course.findById(courseId)
      .populate('teacher', 'name email')
      .populate('students', 'name email rollNumber');
    
    res.status(200).json({
      success: true,
      data: updatedCourse
    });
  } catch (error) {
    console.error('Error removing student from course:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};