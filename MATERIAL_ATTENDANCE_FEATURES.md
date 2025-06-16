# Material Management and Attendance Tracking

This document provides an overview of the material management and attendance tracking features in the Smart Campus Portal.

## Material Management

### Features

#### For Teachers:
- **Upload Materials**: Add text content or external links as course materials
- **Manage Materials**: Edit and delete existing materials
- **Organize by Course**: Materials are organized by courses for easy access

#### For Students:
- **Access Materials**: View all materials for enrolled courses
- **Material Details**: View full content or access external links
- **Organized by Course**: Easy filtering by course

### Implementation

#### Backend:
- MongoDB Material model with references to Course model
- RESTful API endpoints for material CRUD operations
- Authorization checks to ensure only teachers can modify materials

#### Frontend:
- Material context for state management
- Separate components for teacher and student interfaces
- Responsive UI with Bootstrap cards for displaying materials

## Attendance Tracking

### Features

#### For Teachers:
- **Mark Attendance**: Record student attendance for each class
- **Multiple Status Options**: Mark students as present, absent, late, or excused
- **Edit Attendance**: Update attendance records for a specific date
- **Attendance Summary**: View course-wide attendance statistics
- **Student Performance**: Track individual student attendance rates

#### For Students:
- **View Attendance**: See personal attendance records for each course
- **Attendance Statistics**: View attendance percentage and breakdown
- **Alerts**: Warning indicators for low attendance rates

### Implementation

#### Backend:
- MongoDB Attendance model with embedded student records
- Date-based attendance tracking with status options
- API endpoints for marking and retrieving attendance
- Statistical calculations for attendance summaries

#### Frontend:
- Attendance context for state management
- Interactive attendance marking interface for teachers
- Visual attendance statistics and charts for students
- Date-based filtering and organization

## API Endpoints

### Material Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/materials/course/:courseId | Get materials for course | Both |
| GET | /api/materials/:id | Get specific material | Both |
| POST | /api/materials | Create new material | Teacher |
| PUT | /api/materials/:id | Update material | Teacher |
| DELETE | /api/materials/:id | Delete material | Teacher |

### Attendance Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/attendance | Mark attendance | Teacher |
| GET | /api/attendance/course/:courseId | Get all attendance for course | Both |
| GET | /api/attendance/course/:courseId/date/:date | Get attendance for specific date | Both |
| GET | /api/attendance/statistics/course/:courseId/student/:studentId | Get student stats | Both |
| GET | /api/attendance/summary/course/:courseId | Get course summary | Teacher |

## Future Enhancements

### Material Management
- File upload support for documents, presentations, etc.
- Material categorization and tagging
- Material search functionality
- Due dates and scheduling for material release

### Attendance Tracking
- QR code or biometric attendance marking
- Automated absence notifications
- Attendance export to CSV/PDF
- Integration with academic performance metrics