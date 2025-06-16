const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Utility script to clean up database issues
 * This can be run directly using: node utils/dbCleanup.js
 */

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const cleanupDatabase = async () => {
  try {
    console.log('Starting database cleanup...');
    
    // 1. Remove users with null rollNumber that are teachers
    const teachersWithRollNumbers = await User.deleteMany({
      role: 'teacher',
      rollNumber: { $ne: undefined }
    });
    console.log(`Removed ${teachersWithRollNumbers.deletedCount} teachers with roll numbers`);
    
    // 2. Remove users with null teacherId that are students
    const studentsWithTeacherIds = await User.deleteMany({
      role: 'student',
      teacherId: { $ne: undefined }
    });
    console.log(`Removed ${studentsWithTeacherIds.deletedCount} students with teacher IDs`);
    
    // 3. Fix any null entries that have unique constraints
    const nullRollNumbers = await User.find({ rollNumber: null });
    if (nullRollNumbers.length > 0) {
      console.log(`Found ${nullRollNumbers.length} users with null roll numbers`);
      
      // Delete all null rollNumbers
      await User.deleteMany({ rollNumber: null });
      console.log(`Removed users with null roll numbers`);
    }
    
    const nullTeacherIds = await User.find({ teacherId: null });
    if (nullTeacherIds.length > 0) {
      console.log(`Found ${nullTeacherIds.length} users with null teacher IDs`);
      
      // Delete all null teacherIds
      await User.deleteMany({ teacherId: null });
      console.log(`Removed users with null teacher IDs`);
    }
    
    // 4. Check for cross-role ID conflicts (student rollNumber = teacher teacherId)
    const allStudents = await User.find({ role: 'student' });
    const allTeachers = await User.find({ role: 'teacher' });
    
    const rollNumbers = new Set(allStudents.map(student => student.rollNumber));
    const teacherIds = new Set(allTeachers.map(teacher => teacher.teacherId));
    
    const conflicts = [];
    for (const rollNumber of rollNumbers) {
      if (teacherIds.has(rollNumber)) {
        conflicts.push(rollNumber);
      }
    }
    
    if (conflicts.length > 0) {
      console.log(`Found ${conflicts.length} ID conflicts between students and teachers`);
      console.log('Conflicts:', conflicts);
      console.log('Please manually resolve these conflicts by changing one of the IDs');
    }
    
    console.log('Database cleanup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during database cleanup:', error);
    process.exit(1);
  }
};

// Run the cleanup function
cleanupDatabase();