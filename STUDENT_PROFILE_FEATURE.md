# Student Profile Management

This document provides an overview of the student profile management feature in the Smart Campus Portal.

## Overview

The Student Profile Management feature allows students to view and update their personal information, contact details, and professional links. This helps in maintaining up-to-date records and provides students with a centralized place to manage their academic profile information.

## Features

- **Personal Information Management**: Students can update their name, email, phone number, and department
- **Resume Link**: Students can add a link to their online resume (hosted on Google Drive, Dropbox, etc.)
- **Professional Platform Links**: Students can add links to their profiles on:
  - GitHub
  - LinkedIn
  - LeetCode
  - HackerRank
- **Input Validation**: Form validation for all fields to ensure data integrity
- **Instant Feedback**: Success and error messages for form submission

## Implementation

### Backend

#### User Model Enhancements

The existing User schema has been extended to include additional fields:

```javascript
// Additional Profile Fields
phone: {
  type: String,
  match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please enter a valid phone number'],
  default: ''
},
resumeLink: {
  type: String,
  default: ''
},
github: {
  type: String,
  default: ''
},
linkedin: {
  type: String,
  default: ''
},
leetcode: {
  type: String,
  default: ''
},
hackerrank: {
  type: String,
  default: ''
}
```

#### API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/profile | Get user profile | Private |
| PUT | /api/profile | Update user profile | Private |

### Frontend

#### Context API

A ProfileContext was created to manage profile state and API interactions:

- `getProfile()`: Fetch the current user's profile data
- `updateProfile()`: Update the user's profile information
- State management for loading, errors, and success messages

#### Components

- `StudentProfile.js`: Main component for displaying and editing profile information
- Sections for:
  - Personal Information
  - Resume Link
  - Coding Platforms & Social Links

#### UI Features

- Clean, organized form layout with Bootstrap styling
- Input groups with relevant icons for each field
- Real-time validation feedback
- Preview links for social and professional platforms
- Loading indicators for async operations
- Success and error notifications

## User Flow

1. Student navigates to the "Profile" section in the dashboard
2. System automatically loads the student's current profile information
3. Student can edit any field in the form
4. On submission:
   - Form validates all inputs
   - If validation passes, the profile is updated
   - Success message is displayed
   - If errors occur, error feedback is shown

## Future Enhancements

- Profile picture upload capability
- Academic achievements section
- Skills and interests tags
- Privacy settings to control which information is visible to others
- PDF resume upload and storage
- Export profile as PDF/resume
- Integration with career services and job placement features