import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { FaSignInAlt, FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    roll: ''
  });
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { login, isAuthenticated, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, clearError]);

  const { email, password, roll } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAdminLogin = () => {
    setIsAdmin(!isAdmin);
    setFormData({
      email: '',
      password: '',
      roll: ''
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage({ type: '', message: '' });

    try {
      let loginData;
      if (isAdmin) {
        loginData = { roll, password };
      } else {
        loginData = { email, password };
      }

      const res = await login(loginData);
      
      if (res.success) {
        // Redirect based on role
        if (res.role === 'student') {
          navigate('/student');
        } else if (res.role === 'teacher') {
          navigate('/teacher');
        } else if (res.role === 'admin') {
          navigate('/admin');
        }
      } else {
        setAlertMessage({ type: 'danger', message: res.message });
      }
    } catch (err) {
      setAlertMessage({ type: 'danger', message: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="shadow">
        <Card.Header as="h4" className="bg-primary text-white py-3 text-center">
          <FaSignInAlt className="me-2" /> Login to Smart Campus
        </Card.Header>
        <Card.Body className="auth-form">
          <div className="mb-4 text-center">
            <Button
              variant={!isAdmin ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => !isAdmin ? null : toggleAdminLogin()}
            >
              {!isAdmin ? <FaUserGraduate className="me-1" /> : <FaChalkboardTeacher className="me-1" />}
              {!isAdmin ? 'Student' : 'Teacher'}
            </Button>
            <Button
              variant={isAdmin ? 'primary' : 'outline-primary'}
              onClick={() => isAdmin ? null : toggleAdminLogin()}
            >
              <FaUserShield className="me-1" /> Admin
            </Button>
          </div>

          {alertMessage.message && (
            <Alert variant={alertMessage.type} onClose={() => setAlertMessage({ type: '', message: '' })} dismissible>
              {alertMessage.message}
            </Alert>
          )}

          <Form onSubmit={onSubmit}>
            {isAdmin ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Admin ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter admin ID"
                    name="roll"
                    value={roll}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
              </>
            )}

            <div className="d-grid gap-2 mt-4">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                className="py-2"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </Form>
          
          {!isAdmin && (
            <div className="text-center mt-4">
              <p>
                Don't have an account?{' '}
                <Link to="/register">Register</Link>
              </p>
              <p className="text-muted small">
                <Link to="/forgot-password">Forgot Password?</Link>
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;