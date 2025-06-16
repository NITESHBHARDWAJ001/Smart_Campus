import React, { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { 
  FaBook, 
  FaUserCircle, 
  FaCalendarCheck, 
  FaFileAlt, 
  FaChartLine,
  FaTachometerAlt,
  FaUsers,
  FaClipboard
} from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

// Import Components
import TeacherCoursesComponent from '../../components/courses/TeacherCourses';
import TeacherMaterials from '../../components/materials/TeacherMaterials';
import TeacherAttendance from '../../components/attendance/TeacherAttendance';
import TeacherAssignments from '../../components/assignments/TeacherAssignments';

// Placeholder components for teacher features
const Dashboard = () => (
  <div>
    <h2 className="mb-4"><FaTachometerAlt className="me-2" /> Teacher Overview</h2>
    <Row className="g-4">
      <Col md={4}>
        <Card className="dashboard-card shadow">
          <Card.Body>
            <div className="icon-container mb-3">
              <FaBook className="card-icon" />
            </div>
            <Card.Title>My Courses</Card.Title>
            <Card.Text>
              Manage all your courses and teaching materials.
            </Card.Text>
            <Link to="/teacher/courses" className="btn btn-sm btn-primary">
              View Courses
            </Link>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={4}>
        <Card className="dashboard-card shadow">
          <Card.Body>
            <div className="icon-container mb-3">
              <FaUsers className="card-icon" />
            </div>
            <Card.Title>Student Management</Card.Title>
            <Card.Text>
              View and manage your students.
            </Card.Text>
            <Link to="/teacher/students" className="btn btn-sm btn-primary">
              View Students
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
            <Card.Title>Attendance Tracking</Card.Title>
            <Card.Text>
              Mark and manage student attendance.
            </Card.Text>
            <Link to="/teacher/attendance" className="btn btn-sm btn-primary">
              Manage Attendance
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

const Courses = () => (
  <div>
    <h2 className="mb-4"><FaBook className="me-2" /> Course Management</h2>
    <TeacherCoursesComponent />
  </div>
);

const Students = () => (
  <div>
    <h2 className="mb-4"><FaUsers className="me-2" /> Student Management</h2>
    <p>Your students will appear here.</p>
  </div>
);

const Attendance = () => (
  <div>
    <h2 className="mb-4"><FaCalendarCheck className="me-2" /> Attendance Management</h2>
    <TeacherAttendance />
  </div>
);

const Materials = () => (
  <div>
    <h2 className="mb-4"><FaFileAlt className="me-2" /> Course Materials</h2>
    <TeacherMaterials />
  </div>
);

const Assignments = () => (
  <div>
    <h2 className="mb-4"><FaClipboard className="me-2" /> Course Assignments</h2>
    <TeacherAssignments />
  </div>
);

const Performance = () => (
  <div>
    <h2 className="mb-4"><FaChartLine className="me-2" /> Student Performance</h2>
    <p>Student performance analytics will appear here.</p>
  </div>
);

const TeacherDashboard = () => {
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
                <h5>{user?.name || 'Teacher'}</h5>
                <div className="small text-muted">{user?.email || 'teacher@example.com'}</div>
                <div className="small text-muted mb-3">ID: {user?.teacherId || 'N/A'}</div>
              </Card.Body>
            </Card>

            <Nav className="flex-column">
              <Nav.Link as={Link} to="/teacher" className="rounded mb-2 nav-link-hover">
                <FaTachometerAlt className="me-2" /> Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/teacher/courses" className="rounded mb-2 nav-link-hover">
                <FaBook className="me-2" /> Courses
              </Nav.Link>
              <Nav.Link as={Link} to="/teacher/students" className="rounded mb-2 nav-link-hover">
                <FaUsers className="me-2" /> Students
              </Nav.Link>
              <Nav.Link as={Link} to="/teacher/attendance" className="rounded mb-2 nav-link-hover">
                <FaCalendarCheck className="me-2" /> Attendance
              </Nav.Link>
              <Nav.Link as={Link} to="/teacher/materials" className="rounded mb-2 nav-link-hover">
                <FaFileAlt className="me-2" /> Materials
              </Nav.Link>
              <Nav.Link as={Link} to="/teacher/assignments" className="rounded mb-2 nav-link-hover">
                <FaClipboard className="me-2" /> Assignments
              </Nav.Link>
              <Nav.Link as={Link} to="/teacher/performance" className="rounded mb-2 nav-link-hover">
                <FaChartLine className="me-2" /> Performance
              </Nav.Link>
                 <Nav.Link as={Link} to="/teacher/NoticeViewPage" className="rounded mb-2 nav-link-hover">
                <FaChartLine className="me-2" /> Notices & Events
              </Nav.Link>
            </Nav>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="ms-sm-auto px-md-4 py-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/students" element={<Students />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/performance" element={<Performance />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherDashboard;