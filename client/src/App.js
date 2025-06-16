import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { checkApiConnectivity } from './utils/apiCheck';
import { checkDatabaseConnection } from './utils/databaseChecker';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Authentication Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import StudentDashboard from './pages/dashboards/StudentDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { MaterialProvider } from './context/MaterialContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { ProfileProvider } from './context/ProfileContext';
import { AssignmentProvider } from './context/AssignmentContext';
import { PlacementProvider } from './context/PlacementContext';
import PrivateRoute from './components/routing/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import NoticeAdminPage from './components/notice/NoticeAdminPage';
import NoticesViewPage from './components/notice/NoticesViewPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  useEffect(() => {
    // Check API connectivity when the app starts
    checkApiConnectivity()
      .then(result => {
        if (!result.success) {
          console.warn('API connectivity check failed. Make sure your server is running.');
        } else {
          // If basic API check passed, also check database connection
          checkDatabaseConnection()
            .then(dbResult => {
              if (!dbResult.success) {
                console.warn('Database connection check failed:', dbResult.message);
                
                // In development mode, don't show errors to users
                if (process.env.NODE_ENV === 'development') {
                  console.log('Development mode: Ignoring database connection issues');
                  return;
                }
              } else {
                console.log('Database connected successfully');
              }
            })
            .catch(err => {
              console.error('Database connection check error:', err);
              
              // In development mode, continue anyway
              if (process.env.NODE_ENV === 'development') {
                console.log('Development mode: Continuing despite database check error');
              }
            });
        }
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="py-4">
          <Container>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}                <Route path="/student/*" 
                element={
                  <PrivateRoute role="student">
                    <ProfileProvider>
                      <CourseProvider>
                        <MaterialProvider>
                          <AttendanceProvider>
                            <AssignmentProvider>
                              <PlacementProvider>
                                <StudentDashboard />
                                <NoticesViewPage />
                              </PlacementProvider>
                            </AssignmentProvider>
                          </AttendanceProvider>
                        </MaterialProvider>
                      </CourseProvider>
                    </ProfileProvider>
                  </PrivateRoute>
                } 
              />                <Route path="/teacher/*" 
                element={
                  <PrivateRoute role="teacher">
                    <CourseProvider>
                      <MaterialProvider>
                        <AttendanceProvider>
                          <AssignmentProvider>
                            <TeacherDashboard />
                            <NoticesViewPage />
                          </AssignmentProvider>
                        </AttendanceProvider>
                      </MaterialProvider>
                    </CourseProvider>
                  </PrivateRoute>
                } 
              />
              <Route path="/admin/*" 
                element={
                  <PrivateRoute role="admin">
                    <ProfileProvider>
                      <PlacementProvider>
                        <AdminDashboard />
                        <NoticeAdminPage />
                        <NoticesViewPage />
                      </PlacementProvider>
                    </ProfileProvider>
                  </PrivateRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;