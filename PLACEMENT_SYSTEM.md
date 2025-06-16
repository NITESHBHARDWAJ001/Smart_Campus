# Placement Management System

This document provides an overview of the placement management system implemented in the Smart Campus Portal.

## Overview

The placement management system allows educational institutions to manage job opportunities, internships, and placements for students. Administrators can post opportunities, and students can apply to them. Administrators can then review applications and select candidates.

## Features

### For Administrators:
- **Create Placement Opportunities**: Add details like job title, company name, description, requirements, location, and application deadline
- **Manage Placements**: Edit, delete, and toggle active status of placements
- **View Applicants**: See a list of students who applied for each placement
- **Review Applications**: View student details, cover letters, and resume links
- **Update Application Status**: Mark applications as Under Review, Selected, or Rejected
- **Filter and Sort**: Organize placements and applications effectively

### For Students:
- **View Placement Opportunities**: Browse all active placement opportunities
- **Filter Placements**: Filter by all, active, or deadline approaching
- **Apply for Placements**: Submit applications with cover letter and resume link
- **Track Applications**: View status (Applied, Under Review, Selected, Rejected)
- **Withdraw Applications**: Option to withdraw pending applications before deadline

## Implementation

### Backend

#### Placement Model

The Placement schema includes:

```javascript
{
  title: String,              // Job title
  company: String,            // Company name
  description: String,        // Job description
  location: String,           // Job location
  salary: String,             // Salary information (optional)
  type: String,               // Full-time, Part-time, Internship, Contract
  requirements: String,       // Job requirements
  deadline: Date,             // Application deadline
  active: Boolean,            // Whether placement is active
  createdBy: ObjectId,        // Reference to User (admin) who created
  createdAt: Date             // When the placement was created
}
```

#### Application Model

The Application schema includes:

```javascript
{
  studentId: ObjectId,        // Reference to User (student) model
  placementId: ObjectId,      // Reference to Placement model
  status: String,             // Applied, Under Review, Selected, Rejected
  coverLetter: String,        // Student's cover letter
  resumeLink: String,         // Link to student's resume
  applicationDate: Date,      // When the application was submitted
  updatedAt: Date             // When the application was last updated
}
```

#### API Endpoints

**Placements**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/placements | Get all placements | Both |
| GET | /api/placements/:id | Get specific placement | Both |
| POST | /api/placements | Create new placement | Admin |
| PUT | /api/placements/:id | Update placement | Admin |
| DELETE | /api/placements/:id | Delete placement | Admin |
| PUT | /api/placements/:id/toggle-active | Toggle active status | Admin |
| GET | /api/placements/:id/applications | View applications for placement | Admin |

**Applications**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/applications | Apply for placement | Student |
| GET | /api/applications/my-applications | Get student's applications | Student |
| GET | /api/applications/:id | Get application details | Both (with restrictions) |
| PUT | /api/applications/:id/status | Update application status | Admin |
| DELETE | /api/applications/:id | Withdraw/delete application | Both (with restrictions) |

### Frontend

#### Context API
- **PlacementContext**: Manages state and operations for placements and applications

#### Admin Components
- **AdminPlacements.js**: Main component for managing placement opportunities
- Features:
  - CRUD operations for placements
  - Application management
  - Status updates
  - Detailed views

#### Student Components
- **StudentPlacements.js**: Main component for browsing and applying to placements
- Features:
  - Filtering placements
  - Application submission
  - Status tracking
  - Application history

## UI Features

### Placement Cards
- Color coding for active/inactive status
- Visual indicators for approaching deadlines
- Company and job information clearly displayed

### Application Cards
- Status badges (Applied, Under Review, Selected, Rejected)
- Color-coded borders based on status
- Application date and deadline information

### Forms
- Validation for required fields
- Date formatting and validation
- Responsive design for mobile and desktop

## User Experience Improvements

1. **Status Badges**: Visual indicators for application status
2. **Deadline Alerts**: Warnings for approaching or passed deadlines
3. **Filtering Options**: Easy filtering of placements and applications
4. **Modal Interfaces**: Clean, focused interfaces for detailed operations
5. **Responsive Design**: Works well on different screen sizes

## Future Enhancements

1. **Notifications**: Email or in-app notifications for status changes
2. **Interview Scheduling**: Built-in scheduling for interviews
3. **Placement Statistics**: Analytics on placement rates and trends
4. **Advanced Filtering**: Filter by job type, salary range, etc.
5. **Bulk Operations**: Process multiple applications at once
6. **Document Upload**: Direct file upload for resumes and supporting documents
7. **Company Profiles**: Extended information about companies
8. **Alumni Placements**: Track post-graduation employment
9. **Integration with Calendar**: Deadline reminders in calendar