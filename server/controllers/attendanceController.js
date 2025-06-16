const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Mark attendance for a course
// @route   POST /api/attendance
// @access  Private (Teacher only)
exports.markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body;
    const userId = req.user.id;

    // Format date to include only year, month, day (no time)
    const formattedDate = new Date(date);
    formattedDate.setUTCHours(0, 0, 0, 0);

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
        message: 'You can only mark attendance for courses you teach'
      });
    }

    // Check if attendance for this course and date already exists
    let attendance = await Attendance.findOne({
      courseId,
      date: formattedDate
    });

    if (attendance) {
      // Update existing attendance
      attendance.records = records;
      attendance.markedBy = userId;
      await attendance.save();
    } else {
      // Create new attendance
      attendance = await Attendance.create({
        courseId,
        date: formattedDate,
        records,
        markedBy: userId
      });
    }

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Attendance for this date has already been marked'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get attendance for a course on a specific date
// @route   GET /api/attendance/course/:courseId/date/:date
// @access  Private
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { courseId, date } = req.params;
    const userId = req.user.id;

    // Format date to include only year, month, day
    const formattedDate = new Date(date);
    formattedDate.setUTCHours(0, 0, 0, 0);

    // Check if course exists
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
        message: 'You are not authorized to access attendance for this course'
      });
    }

    // Get attendance
    const attendance = await Attendance.findOne({
      courseId,
      date: formattedDate
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No attendance records found for this date'
      });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error getting attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all attendance records for a course
// @route   GET /api/attendance/course/:courseId
// @access  Private
exports.getAttendanceByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is authorized
    const isTeacher = course.teacher.toString() === userId;
    const isStudent = course.students.some(
      student => student.toString() === userId
    );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access attendance for this course'
      });
    }

    // Get all attendance records sorted by date (newest first)
    const attendance = await Attendance.find({ courseId })
      .sort({ date: -1 });

    // If it's a student, filter records to show only their own attendance
    if (isStudent && !isTeacher) {
      attendance.forEach(record => {
        if (record.records) {
          record.records = record.records.filter(
            r => r.studentId.toString() === userId
          );
        }
      });
    }

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    console.error('Error getting attendance records:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get attendance statistics for a student in a course
// @route   GET /api/attendance/statistics/course/:courseId/student/:studentId
// @access  Private
exports.getStudentAttendanceStatistics = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is authorized
    const isTeacher = course.teacher.toString() === userId;
    const isRequestingOwnStats = studentId === userId;
    
    if (!isTeacher && !isRequestingOwnStats) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access these attendance statistics'
      });
    }

    // Get all attendance records for this course
    const attendanceRecords = await Attendance.find({ courseId });

    // Compile statistics
    let totalClasses = attendanceRecords.length;
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    attendanceRecords.forEach(record => {
      const studentRecord = record.records.find(
        r => r.studentId.toString() === studentId
      );
      
      if (studentRecord) {
        switch (studentRecord.status) {
          case 'present':
            present++;
            break;
          case 'absent':
            absent++;
            break;
          case 'late':
            late++;
            break;
          case 'excused':
            excused++;
            break;
          default:
            break;
        }
      } else {
        // If no record found, count as absent
        absent++;
      }
    });

    // Calculate attendance percentage
    const attendancePercentage = totalClasses > 0
      ? ((present + excused + late) / totalClasses) * 100
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalClasses,
        present,
        absent,
        late,
        excused,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100 // Round to 2 decimal places
      }
    });
  } catch (error) {
    console.error('Error getting attendance statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get course attendance summary (for teacher)
// @route   GET /api/attendance/summary/course/:courseId
// @access  Private (Teacher only)
exports.getCourseAttendanceSummary = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId)
      .populate('students', 'name rollNumber');
      
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
        message: 'You can only view summary for courses you teach'
      });
    }

    // Get all attendance records for this course
    const attendanceRecords = await Attendance.find({ courseId });

    // Generate summary
    const totalClasses = attendanceRecords.length;
    const summary = [];

    if (course.students && course.students.length > 0) {
      // For each student in the course
      course.students.forEach(student => {
        let present = 0;
        let absent = 0;
        let late = 0;
        let excused = 0;

        // Go through all attendance records
        attendanceRecords.forEach(record => {
          const studentRecord = record.records.find(
            r => r.studentId.toString() === student._id.toString()
          );
          
          if (studentRecord) {
            switch (studentRecord.status) {
              case 'present':
                present++;
                break;
              case 'absent':
                absent++;
                break;
              case 'late':
                late++;
                break;
              case 'excused':
                excused++;
                break;
              default:
                absent++; // Default to absent if status not recognized
            }
          } else {
            // If no record found for this class, count as absent
            absent++;
          }
        });

        const attendancePercentage = totalClasses > 0
          ? ((present + excused + late) / totalClasses) * 100
          : 0;

        summary.push({
          studentId: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
          present,
          absent,
          late,
          excused,
          attendancePercentage: Math.round(attendancePercentage * 100) / 100
        });
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalClasses,
        studentCount: course.students.length,
        summary
      }
    });
  } catch (error) {
    console.error('Error getting course attendance summary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};