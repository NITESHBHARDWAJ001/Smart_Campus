# Course Management System

This document provides an overview of the course management feature in the Smart Campus Portal.

## Features

### For Teachers:
- **Create Courses**: Teachers can create courses with name and description.
- **Manage Courses**: Edit and delete courses as needed.
- **Add Students**: Teachers can add students to their courses by roll number.
- **View Enrolled Students**: View all students enrolled in each course.
- **Remove Students**: Remove students from courses when needed.

### For Students:
- **View Courses**: Students can see all courses they are enrolled in.
- **Course Details**: View detailed information about each course.
- **See Classmates**: See other students enrolled in the same courses.

## Technical Implementation

### Backend:
- MongoDB Course model with references to User model
- RESTful API endpoints for course CRUD operations
- Authentication middleware for secure access

### Frontend:
- React components for teacher and student interfaces
- Bootstrap and React-Bootstrap for UI elements
- React Icons for improved visual experience
- React Context API for state management

## API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/courses | Get all courses for user | Both |
| GET | /api/courses/:id | Get a specific course | Both |
| POST | /api/courses | Create a new course | Teacher |
| PUT | /api/courses/:id | Update course details | Teacher |
| DELETE | /api/courses/:id | Delete a course | Teacher |
| POST | /api/courses/:id/students | Add student to course | Teacher |
| DELETE | /api/courses/:id/students/:studentId | Remove student from course | Teacher |

## Usage

### Adding a Student to a Course:

1. Teacher logs into their account
2. Navigates to the Courses section
3. Selects a course and clicks the "Add Student" button
4. Enters the student's roll number
5. System validates and adds the student to the course

### Viewing Enrolled Courses (Student):

1. Student logs into their account
2. Navigates to the Courses section
3. Views all courses they are enrolled in
4. Clicks on course details to see more information

## Future Enhancements

- **Course Materials**: Allow teachers to upload and manage course materials
- **Assignments**: Create, distribute, and grade assignments within courses
- **Discussion Forum**: Enable course-specific discussions
- **Announcements**: Course announcement system for important updates
- **Grading System**: Track and manage student grades for assignments