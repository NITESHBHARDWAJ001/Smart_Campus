import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaArrowRight } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // If authenticated, redirect to respective dashboard
  if (isAuthenticated && user) {
    if (user.role === 'student') {
      return <Navigate to="/student" />;
    }
    if (user.role === 'teacher') {
      return <Navigate to="/teacher" />;
    }
    if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    }
  }

  return (
    <Container>
      <Row className="py-5 align-items-center">
        <Col lg={6} className="mb-5 mb-lg-0">
          <h1 className="display-4 fw-bold mb-4">Welcome to Smart Campus Portal</h1>
          <p className="lead mb-4">
            A comprehensive platform designed to enhance the academic experience for students,
            teachers and administrators. Manage courses, track performance, and streamline
            campus activities all in one place.
          </p>
          <div className="d-grid gap-2 d-md-flex">
            <Button 
              as={Link} 
              to="/login" 
              variant="primary"
              size="lg"
              className="me-md-2"
            >
              Login
            </Button>
            <Button 
              as={Link} 
              to="/register" 
              variant="outline-primary"
              size="lg"
            >
              Register
            </Button>
          </div>
        </Col>
        <Col lg={6}>
          <img 
            src="https://placehold.co/600x400?text=Smart+Campus" 
            alt="Smart Campus" 
            className="img-fluid rounded shadow"
          />
        </Col>
      </Row>

      <Row className="py-5">
        <Col className="text-center mb-4">
          <h2 className="fw-bold">Who can use Smart Campus Portal?</h2>
          <p className="lead">Our platform serves different stakeholders in the campus ecosystem</p>
        </Col>
      </Row>

      <Row className="mb-5 g-4">
        <Col md={4}>
          <Card className="h-100 shadow">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block">
                  <FaUserGraduate className="text-primary" size={40} />
                </div>
              </div>
              <Card.Title className="text-center fw-bold mb-3">Students</Card.Title>
              <Card.Text>
                Access course materials, check attendance, view assignments, manage your profile,
                and apply for placement opportunities.
              </Card.Text>
              <div className="mt-auto text-center">
                <Button as={Link} to="/register" variant="outline-primary" className="mt-3">
                  Student Registration <FaArrowRight className="ms-1" />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 shadow">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block">
                  <FaChalkboardTeacher className="text-primary" size={40} />
                </div>
              </div>
              <Card.Title className="text-center fw-bold mb-3">Teachers</Card.Title>
              <Card.Text>
                Create and manage courses, track student performance, upload learning materials,
                mark attendance, and post assignments.
              </Card.Text>
              <div className="mt-auto text-center">
                <Button as={Link} to="/register" variant="outline-primary" className="mt-3">
                  Teacher Registration <FaArrowRight className="ms-1" />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 shadow">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block">
                  <FaUserShield className="text-primary" size={40} />
                </div>
              </div>
              <Card.Title className="text-center fw-bold mb-3">Admin</Card.Title>
              <Card.Text>
                Manage users, oversee placement activities, send notifications, and maintain
                the overall campus ecosystem.
              </Card.Text>
              <div className="mt-auto text-center">
                <Button as={Link} to="/login" variant="outline-primary" className="mt-3">
                  Admin Login <FaArrowRight className="ms-1" />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;