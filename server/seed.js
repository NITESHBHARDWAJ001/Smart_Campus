const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Notice = require('./models/Notice');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart_campus')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

// Sample user data
const users = [
  {
    name: 'Admin User',
    rollNo: 'nitesh',
    password: 'nitesh',
    role: 'admin'
  },
  {
    name: 'Teacher User',
    rollNo: 'teacher1',
    password: 'password',
    role: 'teacher'
  },
  {
    name: 'Student User',
    rollNo: 'student1',
    password: 'password',
    role: 'student'
  }
];

// Sample notices data
const notices = [
  {
    title: 'Welcome to Smart Campus Portal',
    description: 'We are excited to launch our new Smart Campus Portal. This platform will be used for all campus announcements and events.',
    createdBy: 'Admin',
    createdAt: new Date('2023-10-01T10:00:00')
  },
  {
    title: 'Campus Maintenance Notice',
    description: 'The campus will be closed for maintenance on Saturday, October 15th. All scheduled activities are cancelled for that day.',
    eventDate: new Date('2023-10-15'),
    createdBy: 'Admin',
    createdAt: new Date('2023-10-05T08:30:00')
  },
  {
    title: 'New Library Hours',
    description: 'Starting next week, the library will be open from 8 AM to 10 PM on weekdays, and 10 AM to 6 PM on weekends.',
    createdBy: 'Admin',
    createdAt: new Date('2023-10-04T14:00:00')
  },
  {
    title: 'Annual Sports Day',
    description: 'The annual sports day will be held on November 5th. All students are encouraged to participate in various events.',
    eventDate: new Date('2023-11-05'),
    createdBy: 'Admin',
    createdAt: new Date('2023-10-06T09:45:00')
  }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    console.log('Users collection cleared');
    
    await Notice.deleteMany({});
    console.log('Notices collection cleared');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users inserted`);

    // Insert notices
    const createdNotices = await Notice.insertMany(notices);
    console.log(`${createdNotices.length} notices inserted`);

    console.log('Database seeding completed successfully!');

    console.log('\nSample Login Credentials:');
    console.log('-------------------------');
    console.log('Admin:    rollNo: nitesh,    password: nitesh');
    console.log('Teacher:  rollNo: teacher1,  password: password');
    console.log('Student:  rollNo: student1,  password: password');
    console.log('-------------------------');

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();