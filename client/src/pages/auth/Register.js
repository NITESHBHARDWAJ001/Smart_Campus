import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student',
    rollNumber: '',
    teacherId: '',
    department: ''
  });
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const { register, isAuthenticated, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, clearError]);

  const { name, email, password, password2, role, rollNumber, teacherId, department } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Update role and clear role-specific fields
  const updateRole = (selectedRole) => {
    setFormData({ 
      ...formData, 
      role: selectedRole,
      // Clear fields that are specific to other roles
      rollNumber: selectedRole === 'student' ? formData.rollNumber : undefined,
      teacherId: selectedRole === 'teacher' ? formData.teacherId : undefined
    });
    
    // Also clear any alert messages when switching roles
    setAlert({ type: '', message: '' });
  };  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: '', message: '' });

    if (password !== password2) {
      setAlert({ type: 'danger', message: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }
    
    if (role === 'student' && !rollNumber) {
      setAlert({ type: 'danger', message: 'Roll number is required for students' });
      setIsLoading(false);
      return;
    }
    
    if (role === 'teacher' && !teacherId) {
      setAlert({ type: 'danger', message: 'Teacher ID is required for teachers' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await register({
        name,
        email,
        password,
        role,
        rollNumber,
        teacherId,
        department
      });

      if (res.success) {
        // Redirect based on role
        if (role === 'student') {
          navigate('/student');
        } else if (role === 'teacher') {
          navigate('/teacher');
        }
      } else {
        // Display the error with focus on the specific field if available
        setAlert({ type: 'danger', message: res.message });
        
        // If the response includes the field that caused the error, focus on it
        if (res.field) {
          const fieldElement = document.getElementsByName(res.field)[0];
          if (fieldElement) {
            fieldElement.focus();
            fieldElement.classList.add('is-invalid');
            setTimeout(() => fieldElement.classList.remove('is-invalid'), 3000);
          }
        }
      }
    } catch (err) {
      setAlert({ type: 'danger', message: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="shadow">
        <Card.Header as="h4" className="bg-primary text-white py-3 text-center">
          <FaUserPlus className="me-2" /> Register for Smart Campus
        </Card.Header>
        <Card.Body className="auth-form">
          <div className="mb-4 text-center">
            <Button
              variant={role === 'student' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => updateRole('student')}
            >
              <FaUserGraduate className="me-1" /> Student
            </Button>
            <Button
              variant={role === 'teacher' ? 'primary' : 'outline-primary'}
              onClick={() => updateRole('teacher')}
            >
              <FaChalkboardTeacher className="me-1" /> Teacher
            </Button>
          </div>

          {alert.message && (
            <Alert variant={alert.type} onClose={() => setAlert({ type: '', message: '' })} dismissible>
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                name="name"
                value={name}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    onChange(e);
                    // Clear validation styles when user types
                    e.target.classList.remove('is-invalid');
                  }}
                  required
                />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength={6}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    required
                    minLength={6}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="department"
                value={department}
                onChange={onChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
                <option value="Chemical">Chemical</option>
              </Form.Select>
            </Form.Group>

            {role === 'student' && (
              <Form.Group className="mb-3">
                <Form.Label>Roll Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your roll number"
                  name="rollNumber"
                  value={rollNumber}
                  onChange={(e) => {
                    onChange(e);
                    // Clear validation styles when user types
                    e.target.classList.remove('is-invalid');
                  }}
                  required
                />
                <Form.Text className="text-muted">
                  Your unique student identifier. This must be unique across the system.
                </Form.Text>
              </Form.Group>
            )}
            
            {role === 'teacher' && (
              <Form.Group className="mb-3">
                <Form.Label>Teacher ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your teacher ID"
                  name="teacherId"
                  value={teacherId}
                  onChange={(e) => {
                    onChange(e);
                    // Clear validation styles when user types
                    e.target.classList.remove('is-invalid');
                  }}
                  required
                />
                <Form.Text className="text-muted">
                  Your unique teacher identifier. This must be unique across the system.
                </Form.Text>
              </Form.Group>
            )}

            <div className="d-grid gap-2 mt-4">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </Form>
          
          <div className="text-center mt-4">
            <p>
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;