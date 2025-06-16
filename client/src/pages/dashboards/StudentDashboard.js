import React, { useContext,useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { 
  FaBook, 
  FaUserCircle, 
  FaCalendarCheck, 
  FaFileAlt, 
  FaBriefcase,
  FaTachometerAlt,
  FaClipboard
} from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

// Import Components
import StudentCoursesComponent from '../../components/courses/StudentCourses';
import StudentMaterials from '../../components/materials/StudentMaterials';
import StudentAttendance from '../../components/attendance/StudentAttendance';
import StudentProfile from '../../components/profile/StudentProfile';
import StudentAssignments from '../../components/assignments/StudentAssignments';
import StudentPlacements from '../../components/placements/StudentPlacements';


// Placeholder components for student features
const Dashboard = () => (
  <div>
    <h2 className="mb-4"><FaTachometerAlt className="me-2" /> Student Overview</h2>
    <Row className="g-4">
      <Col md={4}>
        <Card className="dashboard-card shadow">
          <Card.Body>
            <div className="icon-container mb-3">
              <FaBook className="card-icon" />
            </div>
            <Card.Title>My Courses</Card.Title>
            <Card.Text>
              View and access all your enrolled courses.
            </Card.Text>
            <Link to="/student/courses" className="btn btn-sm btn-primary">
              View Courses
            </Link>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={4}>
        <Card className="dashboard-card shadow">
          <Card.Body>
            <div className="icon-container mb-3">
              <FaCalendarCheck className="card-icon" />
            </div>
            <Card.Title>My Attendance</Card.Title>
            <Card.Text>
              Check your attendance records for all courses.
            </Card.Text>
            <Link to="/student/attendance" className="btn btn-sm btn-primary">
              View Attendance
            </Link>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={4}>
        <Card className="dashboard-card shadow">
          <Card.Body>
            <div className="icon-container mb-3">
              <FaClipboard className="card-icon" />
            </div>
            <Card.Title>Assignments</Card.Title>
            <Card.Text>
              View and manage your course assignments.
            </Card.Text>
            <Link to="/student/assignments" className="btn btn-sm btn-primary">
              View Assignments
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
            <Card.Title>Placement Opportunities</Card.Title>
            <Card.Text>
              Browse and apply for placement opportunities.
            </Card.Text>
            <Link to="/student/placements" className="btn btn-sm btn-primary">
              View Placements
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

const Courses = () => (
  <div>
    <h2 className="mb-4"><FaBook className="me-2" /> My Courses</h2>
    <StudentCoursesComponent />
  </div>
);

const Attendance = () => (
  <div>
    <h2 className="mb-4"><FaCalendarCheck className="me-2" /> My Attendance</h2>
    <StudentAttendance />
  </div>
);

const Profile = () => (
  <div>
    <h2 className="mb-4"><FaUserCircle className="me-2" /> My Profile</h2>
    <StudentProfile />
  </div>
);

const Materials = () => (
  <div>
    <h2 className="mb-4"><FaFileAlt className="me-2" /> Course Materials</h2>
    <StudentMaterials />
  </div>
);

const Assignments = () => (
  <div>
    <h2 className="mb-4"><FaClipboard className="me-2" /> My Assignments</h2>
    <StudentAssignments />
  </div>
);

const Placements = () => (
  <div>
    <h2 className="mb-4"><FaBriefcase className="me-2" /> Placements</h2>
    <StudentPlacements />
  </div>
);

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={3} lg={2} className="d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <Card className="mb-4">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <FaUserCircle size={60} className="text-primary" />
                </div>
                <h5>{user?.name || 'Student'}</h5>
                <div className="small text-muted mb-3">{user?.email || 'student@example.com'}</div>
                <Link to="/student/profile" className="btn btn-sm btn-outline-primary">
                  View Profile
                </Link>
              </Card.Body>
            </Card>

            <Nav className="flex-column">
              <Nav.Link as={Link} to="/student" className="rounded mb-2 nav-link-hover">
                <FaTachometerAlt className="me-2" /> Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/student/courses" className="rounded mb-2 nav-link-hover">
                <FaBook className="me-2" /> Courses
              </Nav.Link>
              <Nav.Link as={Link} to="/student/attendance" className="rounded mb-2 nav-link-hover">
                <FaCalendarCheck className="me-2" /> Attendance
              </Nav.Link>
              <Nav.Link as={Link} to="/student/profile" className="rounded mb-2 nav-link-hover">
                <FaUserCircle className="me-2" /> Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/student/materials" className="rounded mb-2 nav-link-hover">
                <FaFileAlt className="me-2" /> Materials
              </Nav.Link>
              <Nav.Link as={Link} to="/student/assignments" className="rounded mb-2 nav-link-hover">
                <FaClipboard className="me-2" /> Assignments
              </Nav.Link>
              <Nav.Link as={Link} to="/student/placements" className="rounded mb-2 nav-link-hover">
                <FaBriefcase className="me-2" /> Placements
              </Nav.Link>
              <Nav.Link as={Link} to="/student/NoticeViewPage" className="rounded mb-2 nav-link-hover">
                <FaBriefcase className="me-2" /> Notice and Events
              </Nav.Link>
            </Nav>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="ms-sm-auto px-md-4 py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/placements" element={<Placements />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;