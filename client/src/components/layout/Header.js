import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch(user.role) {
      case 'student': return '/student';
      case 'teacher': return '/teacher';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  // Get role icon based on user role
  const getRoleIcon = () => {
    if (!user) return null;
    
    switch(user.role) {
      case 'student': return <FaUserGraduate className="me-2" />;
      case 'teacher': return <FaChalkboardTeacher className="me-2" />;
      case 'admin': return <FaUserShield className="me-2" />;
      default: return null;
    }
  };

  return (
    <Navbar bg="primary" variant="dark" expand="md" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Smart Campus Portal
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to={getDashboardLink()}>
                  {getRoleIcon()}
                  Dashboard
                </Nav.Link>
                <Nav.Item className="d-flex align-items-center ms-2">
                  <span className="text-light me-3">Welcome, {user?.name}</span>
                  <Button variant="light" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;