# Smart Campus Portal - Project Documentation

## Title & Problem Statement

**Title:** Smart Campus Portal - Digital Campus Management System

**Problem Statement:**

Educational institutions face challenges in efficiently communicating campus information, events, and notices to their student and faculty communities. Traditional methods like physical bulletin boards, email distributions, and manual announcements are:

1. **Inefficient:** Information may not reach all intended recipients timely
2. **Inconsistent:** Different departments may communicate in different formats
3. **Difficult to track:** No centralized system for maintaining historical announcements
4. **Not role-specific:** Unable to target specific information to relevant roles (admin, teachers, students)
5. **Hard to access:** Information not easily accessible from anywhere, anytime

The Smart Campus Portal aims to solve these problems by providing a centralized, role-based digital platform that facilitates efficient communication through notices and events, ensuring all campus stakeholders have appropriate access to relevant information when needed.

## Technology Stack Used

### Frontend
- **React.js:** Frontend library for building user interfaces
- **HTML5/JSX:** For structuring web components
- **CSS3:** For styling components
- **Bootstrap 5:** CSS framework for responsive design
- **React Icons:** Icon library for UI elements
- **React Router DOM:** For client-side routing
- **Axios:** For HTTP requests to the backend
- **date-fns:** Library for date formatting and manipulation

### Backend
- **Node.js:** JavaScript runtime for server-side code
- **Express.js:** Web application framework for Node.js
- **MongoDB:** NoSQL database for data storage
- **Mongoose:** MongoDB object modeling for Node.js
- **JSON Web Token (JWT):** For authentication and authorization

### Development Tools
- **nodemon:** Development server with auto-refresh
- **dotenv:** For environment variable management
- **Postman:** For API testing

## Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git (optional)
- npm (comes with Node.js)

### Step 1: Clone or Download the Project

```bash
# Using Git
git clone [repository-url]
cd smart_campus3

# Or download and extract the ZIP file
```

### Step 2: Set Up the Backend

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create .env file
```

Create a `.env` file in the server directory with the following content:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart_campus
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
```

### Step 3: Seed the Database with Initial Data

```bash
# In the server directory
node seed.js
```

This will create initial users:
- Admin: `nitesh` / `nitesh`
- Teacher: `teacher1` / `password`
- Student: `student1` / `password`

### Step 4: Start the Backend Server

```bash
# In the server directory
npm run dev
```

The server should start at http://localhost:5000

### Step 5: Set Up the Frontend

```bash
# Navigate to the client directory
cd ../client

# Install dependencies
npm install
```

### Step 6: Start the Frontend Application

```bash
# In the client directory
npm start
```

The React application should start and open in your browser at http://localhost:3000

### Step 7: Log in with Sample Credentials

Use the credentials created in Step 3 to log in and explore the application.

## API Documentation

### Authentication Endpoints

#### 1. User Login

- **Endpoint:** `/api/users/login`
- **Method:** `POST`
- **Description:** Authenticate a user and generate JWT token
- **Request Body:**
  ```json
  {
    "rollNo": "nitesh",
    "password": "nitesh"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "615a5c6e9c1b2d3e4f5a6b7c",
      "name": "Admin User",
      "rollNo": "nitesh",
      "role": "admin"
    }
  }
  ```
- **Error Response (400):**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

#### 2. Get Current User

- **Endpoint:** `/api/users/me`
- **Method:** `GET`
- **Description:** Get logged-in user's profile
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Success Response (200):**
  ```json
  {
    "_id": "615a5c6e9c1b2d3e4f5a6b7c",
    "name": "Admin User",
    "rollNo": "nitesh",
    "role": "admin",
    "createdAt": "2023-10-01T10:30:00.000Z"
  }
  ```
- **Error Response (401):**
  ```json
  {
    "error": "No token, authorization denied"
  }
  ```

### Notice Management Endpoints

#### 1. Get All Notices

- **Endpoint:** `/api/notices`
- **Method:** `GET`
- **Description:** Fetch all notices (accessible to all roles)
- **Success Response (200):**
  ```json
  [
    {
      "_id": "615c8d2f9c1b2d3e4f5a7c8d",
      "title": "Campus Maintenance Notice",
      "description": "The campus will be closed for maintenance on Saturday.",
      "eventDate": "2023-10-15T00:00:00.000Z",
      "createdBy": "Admin",
      "createdAt": "2023-10-05T08:30:00.000Z"
    },
    {
      "_id": "615c8e4f9c1b2d3e4f5a7c8e",
      "title": "New Library Hours",
      "description": "The library will now be open until 10 PM on weekdays.",
      "eventDate": null,
      "createdBy": "Admin",
      "createdAt": "2023-10-04T14:00:00.000Z"
    }
  ]
  ```

#### 2. Create Notice (Admin Only)

- **Endpoint:** `/api/notices`
- **Method:** `POST`
- **Description:** Create a new notice
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Request Body:**
  ```json
  {
    "title": "Important Announcement",
    "description": "All classes will be online next week due to renovations.",
    "eventDate": "2023-10-20T00:00:00.000Z"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "_id": "615d9f609c1b2d3e4f5a7c8f",
    "title": "Important Announcement",
    "description": "All classes will be online next week due to renovations.",
    "eventDate": "2023-10-20T00:00:00.000Z",
    "createdBy": "Admin",
    "createdAt": "2023-10-06T09:45:00.000Z"
  }
  ```
- **Error Response (403):**
  ```json
  {
    "error": "Access denied. Admin only."
  }
  ```

#### 3. Update Notice (Admin Only)

- **Endpoint:** `/api/notices/:id`
- **Method:** `PUT`
- **Description:** Update an existing notice
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Request Body:**
  ```json
  {
    "title": "Updated Announcement",
    "description": "All classes will be online for two weeks due to extended renovations.",
    "eventDate": "2023-10-27T00:00:00.000Z"
  }
  ```
- **Success Response (200):** Updated notice object
- **Error Response (404):**
  ```json
  {
    "error": "Notice not found"
  }
  ```

#### 4. Delete Notice (Admin Only)

- **Endpoint:** `/api/notices/:id`
- **Method:** `DELETE`
- **Description:** Delete a notice
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Success Response (200):**
  ```json
  {
    "message": "Notice removed"
  }
  ```
- **Error Response (404):**
  ```json
  {
    "error": "Notice not found"
  }
  ```

## Database Schema Diagram

### Collections and Relationships

The Smart Campus Portal uses MongoDB with the following collections:

#### 1. Users Collection

```
┌───────────────────────┐
│ User                  │
├───────────────────────┤
│ _id: ObjectId         │
│ name: String          │
│ rollNo: String (unique)│
│ password: String      │
│ role: String (enum)   │
│ createdAt: Date       │
└───────────────────────┘
```

#### 2. Notices Collection

```
┌───────────────────────┐
│ Notice                │
├───────────────────────┤
│ _id: ObjectId         │
│ title: String         │
│ description: String   │
│ createdBy: String     │
│ eventDate: Date (opt) │
│ createdAt: Date       │
└───────────────────────┘
```

### Schema Details

#### User Schema

```javascript
const userSchema = new mongoose.Schema({
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
```

#### Notice Schema

```javascript
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
```

### Data Relationships

While MongoDB is a NoSQL database and doesn't enforce relationships, the application maintains implicit relationships:

- Notices are created by Admins (identified by the createdBy field)
- Users with different roles have different access permissions to notices

## Feature List

### 1. Authentication System

- **Multi-role Login:** Separate access for Admin, Teacher, and Student roles
- **JWT Authentication:** Secure token-based authentication
- **Role-based Authorization:** Access control based on user role
- **Protected Routes:** Frontend routes protected based on user roles

### 2. Notice Management (Admin)

- **Create Notices:** Admin can create new notices with title, description, and optional event date
- **View All Notices:** Admin dashboard displays all notices in a table format
- **Edit Notices:** Update existing notices through a modal interface
- **Delete Notices:** Remove notices with confirmation dialog
- **Form Validation:** Client-side validation for notice creation and editing

### 3. Notice Viewing (All Users)

- **View Notices:** All users can view the list of notices
- **Notice Cards:** Visually appealing card-based layout for notices
- **Event Highlighting:** Visual indicators for upcoming, today's, and past events
- **Date Formatting:** Human-readable date formats

### 4. UI/UX Features

- **Responsive Design:** Works on desktop, tablet, and mobile devices
- **Role-based Navigation:** Different sidebar navigation based on user role
- **Bootstrap Components:** Modern UI using cards, tables, modals, alerts
- **Loading States:** Visual indicators during data fetching
- **Error Handling:** User-friendly error messages
- **Success Notifications:** Feedback for successful operations

### 5. Security Features

- **Token-based Authentication:** JWT for secure API access
- **Role Verification:** Backend middleware to verify user roles for protected actions
- **Input Validation:** Both client and server-side validation
- **Protected API Routes:** Authorization checks on sensitive endpoints

### 6. Navigation and Routing

- **Dynamic Routing:** Different routes based on user role
- **Protected Routes:** Authentication checks before rendering components
- **Sidebar Navigation:** Easy access to different sections
- **Unauthorized Page:** Custom page for unauthorized access attempts
- **404 Page:** Custom page for non-existent routes

This Smart Campus Portal provides an efficient solution for campus communication through notices and events, with appropriate access controls based on user roles.