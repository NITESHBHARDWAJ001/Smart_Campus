# Smart Campus Portal - Database Schema

## MongoDB Schema Visualization

This document provides a visual representation of the database schema used in the Smart Campus Portal application.

## Collections Overview

The Smart Campus Portal uses MongoDB with two main collections:
1. Users Collection
2. Notices Collection

## Schema Diagrams

### Users Collection

```
┌─────────────────────────────────────────────┐
│                   User                      │
├─────────────────────────────────────────────┤
│ _id           : ObjectId                    │
│ name          : String (required)           │
│ rollNo        : String (required, unique)   │
│ password      : String (required)           │
│ role          : String (enum)               │
│                 ["admin", "teacher",        │
│                  "student"]                 │
│ createdAt     : Date (default: Date.now)    │
└─────────────────────────────────────────────┘
```

### Notices Collection

```
┌─────────────────────────────────────────────┐
│                 Notice                      │
├─────────────────────────────────────────────┤
│ _id           : ObjectId                    │
│ title         : String (required)           │
│ description   : String (required)           │
│ createdBy     : String (default: "Admin")   │
│ eventDate     : Date (optional)             │
│ createdAt     : Date (default: Date.now)    │
└─────────────────────────────────────────────┘
```

## Mongoose Schema Definitions

### User Model (User.js)

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
```

### Notice Model (Notice.js)

```javascript
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    default: 'Admin'
  },
  eventDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notice', noticeSchema);
```

## Relationships

In this NoSQL database design:

1. There is no direct foreign key relationship as would exist in a relational database.

2. Implicit relationships:
   - Notices are created by Admins (referenced by the `createdBy` field in the Notice collection)
   - Users with different roles have different access permissions to notices

## Data Flow

```
┌─────────────┐       creates       ┌─────────────┐
│             │─────────────────────▶│             │
│  Admin User │                      │   Notice    │
│             │◀─────────────────────│             │
└─────────────┘      retrieves       └─────────────┘
       ▲                                   ▲
       │                                   │
       │ authenticates                     │ views
       │                                   │
       │                                   │
┌─────────────┐       views         ┌─────────────┐
│  Teacher    │─────────────────────▶│   Notice    │
│    User     │                      │             │
└─────────────┘                      └─────────────┘
       ▲                                   ▲
       │                                   │
       │ authenticates                     │ views
       │                                   │
       │                                   │
┌─────────────┐       views         ┌─────────────┐
│  Student    │─────────────────────▶│   Notice    │
│    User     │                      │             │
└─────────────┘                      └─────────────┘
```

## Sample Documents

### Example User Document

```json
{
  "_id": "615a5c6e9c1b2d3e4f5a6b7c",
  "name": "Admin User",
  "rollNo": "nitesh",
  "password": "nitesh",
  "role": "admin",
  "createdAt": "2023-10-01T10:30:00.000Z"
}
```

### Example Notice Document

```json
{
  "_id": "615c8d2f9c1b2d3e4f5a7c8d",
  "title": "Campus Maintenance Notice",
  "description": "The campus will be closed for maintenance on Saturday.",
  "createdBy": "Admin",
  "eventDate": "2023-10-15T00:00:00.000Z",
  "createdAt": "2023-10-05T08:30:00.000Z"
}
```

## Indexing Strategy

For better performance, the following indexes are recommended:

1. In the Users collection:
   - `rollNo` is indexed (unique) for fast user lookup during authentication
   - `role` can be indexed if role-based queries are frequent

2. In the Notices collection:
   - `createdAt` is indexed for efficient sorting by creation date
   - `eventDate` can be indexed if frequent queries for upcoming events are performed

## Future Schema Extensions

The current schema provides a foundation that can be extended for additional features:

1. Add `departments` to User model for department-specific notices
2. Add `categories` to Notice model for categorized notices
3. Add `attachments` to Notice model for file uploads
4. Create a new `Comments` collection for user feedback on notices

---

This schema design prioritizes simplicity while providing the necessary structure for the Smart Campus Portal's core functionality.