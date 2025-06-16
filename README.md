# Smart Campus Portal

A comprehensive platform for educational institutions built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- Role-based access (Student, Teacher, Admin)
- Course management system
- Student profile management
- Assignment tracking
- Attendance management
- Placement module
- Admin panel

## Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

4. Configure environment variables:
   - Create or update `.env` file in the server directory with:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm run dev
   ```

2. Start the client in a new terminal:
   ```
   cd client
   npm start
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

### Admin Login

- ID: nitesh
- Password: nitesh

## Tech Stack

- **Frontend**: React.js, Bootstrap 5, CSS3, React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

```
smart_campus/
├── client/              # React frontend
│   ├── public/          # Public assets
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # Context API
│       ├── pages/       # Main pages
│       └── App.js       # Main component
├── server/              # Express backend
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
└── README.md            # This file
```

## Troubleshooting

If you encounter CORS issues:
- Make sure the server is running on port 5000
- Check that the client is running on port 3000
- CORS is configured to allow requests from localhost:3000 to localhost:5000

If you see 401 Unauthorized errors:
- Your JWT token might be invalid or expired
- Try logging out and logging in again


# Demo Video link 
https://drive.google.com/file/d/1B82alKFIW3jAoTD3VXMFqnURtw6_2Q0s/view?usp=sharing