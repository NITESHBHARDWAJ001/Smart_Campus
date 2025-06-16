# Database Fixes for Smart Campus Portal

This document provides instructions to fix common database issues with the Smart Campus Portal.

## Common Issues

### Issue 1: Duplicate Key Error for null rollNumber or teacherId

Error message:
```
MongoServerError: E11000 duplicate key error collection: collage.users index: rollNumber_1 dup key: { rollNumber: null }
```

This happens because MongoDB enforces uniqueness even on null values for some index configurations.

### Issue 2: Cross-role ID conflicts

When a teacher's teacherId matches a student's rollNumber, it can cause confusion in the system.

## Fix Instructions

### Step 1: Stop the Server

```bash
# Press Ctrl+C in your server terminal
```

### Step 2: Run the Database Cleanup

```bash
cd server
npm run cleanup
```

This will:
- Remove users with invalid role-field combinations
- Remove duplicate null entries
- Detect cross-role ID conflicts

### Step 3: Fix MongoDB Indexes

```bash
cd server
npm run fix-indexes
```

This will:
- Drop problematic indexes
- Create new indexes with proper configurations
- Ensure uniqueness only applies within roles

### Step 4: Restart the Server

```bash
cd server
npm run dev
```

## Manual Database Cleanup

If you're still experiencing issues, you can manually clean up the database:

### MongoDB Compass

1. Connect to your MongoDB database with MongoDB Compass
2. Navigate to the `users` collection
3. Use filters to identify problematic records
4. Delete problematic entries

### MongoDB Shell

```javascript
// Connect to your database
use collage

// Remove users with null roll numbers
db.users.deleteMany({ rollNumber: null })

// Remove users with null teacher IDs
db.users.deleteMany({ teacherId: null })

// Fix indexes
db.users.dropIndex("rollNumber_1")
db.users.dropIndex("teacherId_1")
db.users.createIndex(
  { rollNumber: 1 }, 
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { role: "student" }
  }
)
db.users.createIndex(
  { teacherId: 1 }, 
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { role: "teacher" }
  }
)
```

## Prevention for Future

1. Always ensure teacher IDs and student roll numbers are unique
2. Use different formats for teacher IDs vs student roll numbers (e.g., prefix with "T-" for teachers)
3. Keep roles and fields consistent (students have roll numbers, teachers have teacher IDs)