const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const fixIndexes = async () => {
  try {
    console.log('Starting to fix MongoDB indexes...');

    // Get a reference to the database and collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // List all indexes
    console.log('Current indexes:');
    const indexes = await usersCollection.indexes();
    console.log(indexes);
    
    // Drop problematic indexes if they exist
    try {
      await usersCollection.dropIndex('rollNumber_1');
      console.log('Dropped rollNumber index');
    } catch (err) {
      console.log('No rollNumber index to drop or error:', err.message);
    }
    
    try {
      await usersCollection.dropIndex('teacherId_1');
      console.log('Dropped teacherId index');
    } catch (err) {
      console.log('No teacherId index to drop or error:', err.message);
    }
    
    // Create new indexes with proper sparse option
    await usersCollection.createIndex(
      { rollNumber: 1 }, 
      { 
        unique: true, 
        sparse: true,
        partialFilterExpression: { role: 'student' }
      }
    );
    console.log('Created new rollNumber index with sparse option and partialFilterExpression');
    
    await usersCollection.createIndex(
      { teacherId: 1 }, 
      { 
        unique: true, 
        sparse: true,
        partialFilterExpression: { role: 'teacher' }
      }
    );
    console.log('Created new teacherId index with sparse option and partialFilterExpression');
    
    // List updated indexes
    console.log('Updated indexes:');
    const updatedIndexes = await usersCollection.indexes();
    console.log(updatedIndexes);
    
    console.log('Index fixing completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing indexes:', err);
    process.exit(1);
  }
};

fixIndexes();