const Material = require('../models/Material');
const Course = require('../models/Course');

// @desc    Create material
// @route   POST /api/materials
// @access  Private (Teachers only)
exports.createMaterial = async (req, res) => {
  try {
    const { courseId, title, content, type } = req.body;
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
        message: 'You can only add materials to courses you teach'
      });
    }

    // Create material
    const material = await Material.create({
      courseId,
      title,
      content,
      type: type || 'text', // Default to text if not specified
      createdBy: userId
    });

    res.status(201).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all materials for a course
// @route   GET /api/materials/course/:courseId
// @access  Private
exports.getMaterialsByCourse = async (req, res) => {
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
        message: 'You are not authorized to access materials for this course'
      });
    }

    // Get materials sorted by newest first
    const materials = await Material.find({ courseId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('Error getting materials:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single material
// @route   GET /api/materials/:id
// @access  Private
exports.getMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find material
    const material = await Material.findById(id).populate('createdBy', 'name');
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Check if user has access to this course
    const course = await Course.findById(material.courseId);
    
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
        message: 'You are not authorized to access this material'
      });
    }

    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error getting material:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private (Teachers only)
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type } = req.body;
    const userId = req.user.id;

    // Find material
    let material = await Material.findById(id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Check if user is the creator of this material
    if (material.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update materials you created'
      });
    }

    // Update material
    material = await Material.findByIdAndUpdate(
      id,
      { title, content, type },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private (Teachers only)
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find material
    const material = await Material.findById(id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Check if user is the creator of this material
    if (material.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete materials you created'
      });
    }

    // Delete material
    await material.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};