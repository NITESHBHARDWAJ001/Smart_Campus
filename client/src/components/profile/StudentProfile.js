import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Form, Row, Col, Alert, Spinner, InputGroup } from 'react-bootstrap';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaFileAlt,
  FaGithub,
  FaLinkedin,
  FaCode,
  FaSave,
  FaExternalLinkAlt,
  FaCheck
} from 'react-icons/fa';
import { SiLeetcode, SiHackerrank } from 'react-icons/si';

import AuthContext from '../../context/AuthContext';
import ProfileContext from '../../context/ProfileContext';

// CSS
import './Profile.css';

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const { profile, loading, error, getProfile, updateProfile, clearError } = useContext(ProfileContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    resumeLink: '',
    github: '',
    linkedin: '',
    leetcode: '',
    hackerrank: ''
  });

  const [changed, setChanged] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        department: profile.department || '',
        resumeLink: profile.resumeLink || '',
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        leetcode: profile.leetcode || '',
        hackerrank: profile.hackerrank || ''
      });
    }
  }, [profile]);

  const loadProfile = async () => {
    await getProfile();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setChanged(true);
    
    // Clear validation error for this field if any
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
    
    // Clear success message if the user starts editing again
    if (updateSuccess) {
      setUpdateSuccess(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Email validation
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional)
    if (formData.phone.trim()) {
      const phonePattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
      if (!phonePattern.test(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
    }
    
    // Department validation
    if (!formData.department.trim()) {
      errors.department = 'Department is required';
    }
    
    // URL validations (all optional)
    const urlPatterns = [
      { field: 'resumeLink', value: formData.resumeLink },
      { field: 'github', value: formData.github },
      { field: 'linkedin', value: formData.linkedin },
      { field: 'leetcode', value: formData.leetcode },
      { field: 'hackerrank', value: formData.hackerrank }
    ];

    urlPatterns.forEach(({ field, value }) => {
      if (value.trim()) {
        try {
          // Check if it's a valid URL
          new URL(value);
        } catch (error) {
          errors[field] = 'Please enter a valid URL starting with http:// or https://';
        }
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setUpdating(true);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setUpdateSuccess(true);
        setChanged(false);
        // Show success message for 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getBaseUrl = (url) => {
    if (!url) return '';
    try {
      const { hostname } = new URL(url);
      return hostname;
    } catch (error) {
      return url;
    }
  };

  const renderLinkPreview = (url, icon, platform) => {
    if (!url) return null;
    
    return (
      <div className="link-preview">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted small">
          {icon} {getBaseUrl(url)} <FaExternalLinkAlt className="ms-1" size={10} />
        </a>
      </div>
    );
  };

  // Prepare platform configuration for cleaner rendering
  const platforms = [
    {
      name: 'github',
      label: 'GitHub',
      icon: <FaGithub className="me-2" />,
      placeholder: 'https://github.com/yourusername'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      icon: <FaLinkedin className="me-2" />,
      placeholder: 'https://linkedin.com/in/yourusername'
    },
    {
      name: 'leetcode',
      label: 'LeetCode',
      icon: <SiLeetcode className="me-2" />,
      placeholder: 'https://leetcode.com/yourusername'
    },
    {
      name: 'hackerrank',
      label: 'HackerRank',
      icon: <SiHackerrank className="me-2" />,
      placeholder: 'https://hackerrank.com/yourusername'
    }
  ];

  if (loading && !profile) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header text-center mb-4">
        <div className="profile-avatar">
          <FaUser className="profile-avatar-icon" />
        </div>
        <h4>{formData.name || 'Student'}</h4>
        <p className="text-muted mb-2">{formData.email || 'student@example.com'}</p>
        <div className="profile-id">
          <span className="badge bg-primary profile-id-badge">
            Roll Number: {user?.rollNumber || 'N/A'}
          </span>
        </div>
      </div>

      {error && (
        <Alert variant="danger" onClose={clearError} dismissible>
          {error}
        </Alert>
      )}
      
      {updateSuccess && (
        <Alert variant="success" onClose={() => setUpdateSuccess(false)} dismissible>
          <FaCheck className="me-2" /> Profile updated successfully!
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <div className="form-section">
              <h5 className="form-section-title">Personal Information</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaUser />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.name}
                        placeholder="Enter your full name"
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.name}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaEnvelope />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.email}
                        placeholder="Enter your email"
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaPhone />
                      </InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.phone}
                        placeholder="Enter your phone number"
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.phone}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaBuilding />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.department}
                        placeholder="Enter your department"
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.department}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="form-section">
              <h5 className="form-section-title">Resume</h5>
              <Form.Group className="mb-3">
                <Form.Label>Resume Link</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaFileAlt />
                  </InputGroup.Text>
                  <Form.Control
                    type="url"
                    name="resumeLink"
                    value={formData.resumeLink}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.resumeLink}
                    placeholder="Enter URL to your resume (Google Drive, Dropbox, etc.)"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.resumeLink}
                  </Form.Control.Feedback>
                </InputGroup>
                {renderLinkPreview(formData.resumeLink, <FaFileAlt className="me-1" />, 'Resume')}
              </Form.Group>
            </div>

            <div className="form-section">
              <h5 className="form-section-title">Coding Platforms & Social Links</h5>
              <Row>
                {platforms.map(platform => (
                  <Col md={6} key={platform.name}>
                    <Form.Group className="mb-3">
                      <Form.Label>{platform.label}</Form.Label>
                      <InputGroup className="social-link-input">
                        <InputGroup.Text>
                          {platform.icon}
                        </InputGroup.Text>
                        <Form.Control
                          type="url"
                          name={platform.name}
                          value={formData[platform.name]}
                          onChange={handleInputChange}
                          isInvalid={!!validationErrors[platform.name]}
                          placeholder={platform.placeholder}
                        />
                        <Form.Control.Feedback type="invalid">
                          {validationErrors[platform.name]}
                        </Form.Control.Feedback>
                      </InputGroup>
                      {renderLinkPreview(formData[platform.name], platform.icon, platform.label)}
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="form-footer d-flex justify-content-end">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={!changed || updating}
              >
                {updating ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StudentProfile;