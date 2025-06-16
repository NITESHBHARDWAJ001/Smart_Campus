import React, { useContext, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { checkDatabaseConnection } from '../../utils/databaseChecker';
import { 
  FaUserShield,
  FaUsers,
  FaBriefcase,
  FaTachometerAlt,
  FaBook,
  FaUniversity,
  FaChartBar,
  FaCog
} from 'react-icons/fa';
import './Dashboard.css';

import AuthContext from '../../context/AuthContext';
import { AdminProvider } from '../../context/AdminContext';
import AdminContext from '../../context/AdminContext';
import AdminUsers from '../../components/admin/AdminUsers';
import AdminPlacements from '../../components/admin/AdminPlacements';
import AdminStats from '../../components/admin/AdminStats';
import AdminPlacementsComponent from '../../components/placements/AdminPlacements';

import { messaging,getToken,onMessage } from '../../firebase/firebase';
const vapidKey = "BNwADXbIoWMCY_C70EW4Y3G9pHKp9M5wGkm98HEPZdGjTWK1lvAFwvWkImnKvJ5gXUr_xkyAxHlc7xtNwH6Zj_0"

// Placeholder components for admin features
const Dashboard = () => (
  <div>
    <h2 className="mb-4"><FaTachometerAlt className="me-2" /> Admin Overview</h2>
    <AdminStats />
    <Row className="g-4 mt-2">
      <Col md={4}>
        <Card className="dashboard-card shadow">
          <Card.Body>
            <div className="icon-container mb-3">
              <FaUsers className="card-icon" />
            </div>
            <Card.Title>Manage Users</Card.Title>
            <Card.Text>
              Manage students, teachers, and admin accounts.
            </Card.Text>
            <Link to="/admin/users" className="btn btn-sm btn-primary">
              View Users
            </Link>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={4}>
        <Card className="dashboard-card shadow">
          <Card.Body>
            <div className="icon-container mb-3">
              <FaBook className="card-icon" />
            </div>
            <Card.Title>Manage Courses</Card.Title>
            <Card.Text>
              Create, edit, and manage course offerings.
            </Card.Text>
            <Link to="/admin/courses" className="btn btn-sm btn-primary">
              View Courses
            </Link>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={4}>
        <Card className="dashboard-card shadow">
          <Card.Body>
            <div className="icon-container mb-3">
              <FaBriefcase className="card-icon" />
            </div>
            <Card.Title>Manage Placements</Card.Title>
            <Card.Text>
              Post and manage placement opportunities.
            </Card.Text>
            <Link to="/admin/placements" className="btn btn-sm btn-primary">
              View Placements
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

const Users = () => (
  <div>
    <h2 className="mb-4"><FaUsers className="me-2" /> Manage Users</h2>
    <AdminUsers />
  </div>
);

const Courses = () => (
  <div>
    <h2 className="mb-4"><FaBook className="me-2" /> Manage Courses</h2>
    <p>Course management interface will appear here.</p>
  </div>
);

const PlacementsAdmin = () => (
  <div>
    <h2 className="mb-4"><FaBriefcase className="me-2" /> Manage Placements</h2>
    <AdminPlacements />
  </div>
);

const Settings = () => (
  <div>
    <h2 className="mb-4"><FaCog className="me-2" /> System Settings</h2>
    <p>System settings interface will appear here.</p>
  </div>
);

const Stats = () => (
  <div>
    <h2 className="mb-4"><FaChartBar className="me-2" /> Campus Statistics</h2>
    <AdminStats showCards={false} />
  </div>
);

const PlacementSystem = () => (
  <div>
    <h2 className="mb-4"><FaBriefcase className="me-2" /> Placement Management</h2>
    <AdminPlacementsComponent />
  </div>
);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // Check database connection when admin dashboard loads
  useEffect(() => {
    console.log('Admin dashboard loaded - checking database connection');
    checkDatabaseConnection()
      .then(result => {
        if (result.success) {
          console.log('✅ Database connection confirmed for admin dashboard');
        } else {
          console.error('❌ Database connection failed for admin dashboard:', result.message);
        }
      })
      .catch(err => console.error('Error checking database connection:', err));

      Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            getToken(messaging, { vapidKey })
              .then((currentToken) => {
                if (currentToken) {
                  console.log('Current token:', currentToken);
                  // You can send this token to your server to save it for push notifications
                } else {
                  console.warn('No registration token available. Request permission to generate one.');
                }
              })
              .catch((err) => {
                console.error('An error occurred while retrieving token. ', err);
              });
      
            onMessage(messaging, (payload) => {
              console.log('Message received. ', payload);
              // Customize notification here
              const notificationTitle = payload.notification.title;
              const notificationOptions = {
                body: payload.notification.body,
              };
      
              new Notification(notificationTitle, notificationOptions);
            }
            );
          }
        })
  }, []);

  return (
    <AdminProvider>
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={3} lg={2} className="d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3">
              <Card className="mb-4">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <FaUserShield size={60} className="text-primary" />
                  </div>
                  <h5>{user?.name || 'Administrator'}</h5>
                  <div className="small text-muted mb-3">{user?.email || 'admin@example.com'}</div>
                </Card.Body>
              </Card>

              <Nav className="flex-column">
                <Nav.Link as={Link} to="/admin" className="rounded mb-2 nav-link-hover">
                  <FaTachometerAlt className="me-2" /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/users" className="rounded mb-2 nav-link-hover">
                  <FaUsers className="me-2" /> Users
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/courses" className="rounded mb-2 nav-link-hover">
                  <FaBook className="me-2" /> Courses
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/placements" className="rounded mb-2 nav-link-hover">
                  <FaBriefcase className="me-2" /> Placements
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/placement-system" className="rounded mb-2 nav-link-hover">
                  <FaBriefcase className="me-2" /> Placement System
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/stats" className="rounded mb-2 nav-link-hover">
                  <FaChartBar className="me-2" /> Statistics
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/settings" className="rounded mb-2 nav-link-hover">
                  <FaCog className="me-2" /> Settings
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/NoticeAdminPage" className="rounded mb-2 nav-link-hover">
                  <FaCog className="me-2" /> Notices & Events
                </Nav.Link>
              </Nav>
            </div>
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="ms-sm-auto px-md-4 py-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/placements" element={<PlacementsAdmin />} />
              <Route path="/placement-system" element={<PlacementSystem />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </AdminProvider>
  );
};

export default AdminDashboard;