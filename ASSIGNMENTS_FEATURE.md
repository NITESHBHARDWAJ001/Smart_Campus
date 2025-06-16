# Assignment Management System

This document provides an overview of the assignment management features in the Smart Campus Portal.

## Overview

The Assignment Management feature allows teachers to create, update, and delete assignments for their courses, and students to view these assignments. This helps organize course work and ensures students are aware of upcoming deadlines.

## Features

### For Teachers:
- **Create Assignments**: Add new assignments with title, description, and due date
- **Manage Assignments**: Edit and delete existing assignments
- **Organize by Course**: Assignments are organized by course for better management

### For Students:
- **View Assignments**: Access all assignments for enrolled courses
- **Filter Assignments**: Filter by upcoming or overdue status
- **Assignment Details**: View detailed assignment instructions
- **Due Date Tracking**: Visual indicators for upcoming, due soon, and overdue assignments

## Implementation

### Backend

#### Assignment Model

The Assignment schema includes:

```javascript
{
  title: String,          // Assignment title
  courseId: ObjectId,     // Reference to Course model
  description: String,    // Assignment description/instructions
  dueDate: Date,          // Assignment deadline
  createdBy: ObjectId,    // Reference to User (teacher) model
  createdAt: Date         // When the assignment was created
}
```

#### API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/assignments/course/:courseId | Get assignments for course | Both |
| GET | /api/assignments/:id | Get specific assignment | Both |
| POST | /api/assignments | Create new assignment | Teacher |
| PUT | /api/assignments/:id | Update assignment | Teacher |
| DELETE | /api/assignments/:id | Delete assignment | Teacher |

### Frontend

#### Assignment Context

The AssignmentContext manages:
- Fetching assignments by course
- Retrieving single assignment details
- Creating new assignments (teachers only)
- Updating and deleting assignments (teachers only)
- Error handling and loading states

#### Teacher Components

- TeacherAssignments.js: Main component for teachers to manage assignments
- Features:
  - Course selection dropdown
  - Assignment creation modal
  - Assignment editing
  - Assignment deletion with confirmation
  - Visual status indicators for assignments

#### Student Components

- StudentAssignments.js: Main component for students to view assignments
- Features:
  - Course selection dropdown
  - Assignment filtering (All, Upcoming, Overdue)
  - Assignment status tracking
  - Detailed assignment view

## User Interface

### Assignment Cards
- Color-coded borders based on status (upcoming, due soon, overdue)
- Clear display of title, description preview, and due date
- Action buttons appropriate for user role

### Assignment Details Modal
- Comprehensive view of assignment instructions
- Clear display of deadline and status
- Created by information

## Future Enhancements

1. **Submission System**: Allow students to submit assignments directly
2. **Grading System**: Enable teachers to grade submitted assignments
3. **Notifications**: Reminders for upcoming assignments
4. **File Attachments**: Support for attaching files to assignments
5. **Comments**: Discussion thread for each assignment
6. **Templates**: Save and reuse assignment templates
7. **Bulk Operations**: Create or update multiple assignments at once