import React, { useState, useEffect, useContext } from 'react';
import { Card, Badge, Button, Form, Row, Col, Alert, Spinner, Modal, Tabs, Tab } from 'react-bootstrap';
import {
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClock,
  FaEye,
  FaUserTie,
  FaPaperPlane,
  FaClipboard,
  FaInfoCircle,
  FaExclamationCircle,
  FaFileAlt,
  FaLink,
  FaCheckCircle,
  FaTimesCircle,
  FaClock as FaClockSolid,
  FaFilter
} from 'react-icons/fa';

import PlacementContext from '../../context/PlacementContext';
import AuthContext from '../../context/AuthContext';
import ProfileContext from '../../context/ProfileContext';

// CSS
import './Placements.css';

const StudentPlacements = () => {
  const { user } = useContext(AuthContext);
  const { profile, getProfile } = useContext(ProfileContext);
  const {
    placements,
    applications,
    loading,
    error,
    getPlacements,
    getPlacement,
    getMyApplications,
    applyForPlacement,
    deleteApplication
  } = useContext(PlacementContext);

  const [activeTab, setActiveTab] = useState('openings');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPlacement, setCurrentPlacement] = useState(null);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    placementId: '',
    coverLetter: '',
    resumeLink: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'deadline'

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (profile && showApplyModal) {
      setApplicationForm(prevForm => ({
        ...prevForm,
        resumeLink: profile.resumeLink || ''
      }));
    }
  }, [profile, showApplyModal]);

  const loadData = async () => {
    if (activeTab === 'openings') {
      const placementsResult = await getPlacements();
      console.log('Student placements loaded:', placementsResult);
    } else if (activeTab === 'applications') {
      const applicationsResult = await getMyApplications();
      console.log('Student applications loaded:', applicationsResult);
    }

    if (!profile) {
      await getProfile();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm({ ...applicationForm, [name]: value });
    
    // Clear validation error for this field if any
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!applicationForm.coverLetter.trim()) {
      errors.coverLetter = 'Cover letter is required';
    } else if (applicationForm.coverLetter.length < 50) {
      errors.coverLetter = 'Cover letter must be at least 50 characters';
    }
    
    if (!applicationForm.resumeLink.trim()) {
      errors.resumeLink = 'Resume link is required';
    } else {
      try {
        // Check if it's a valid URL
        new URL(applicationForm.resumeLink);
      } catch (error) {
        errors.resumeLink = 'Please enter a valid URL starting with http:// or https://';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await applyForPlacement(applicationForm);
      
      if (result.success) {
        setShowApplyModal(false);
        resetForm();
        setAlertMessage({
          type: 'success',
          message: 'Application submitted successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
        await getPlacements();  // Refresh placements to update 'hasApplied' state
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to submit application'
        });
      }
    } catch (error) {
      console.error('Error applying:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleDeleteApplication = async () => {
    try {
      const result = await deleteApplication(currentApplication._id);
      
      if (result.success) {
        setShowDeleteModal(false);
        setCurrentApplication(null);
        setAlertMessage({
          type: 'success',
          message: 'Application withdrawn successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
        await getMyApplications();  // Refresh applications
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to withdraw application'
        });
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const openApplyModal = (placement) => {
    setCurrentPlacement(placement);
    setApplicationForm({
      placementId: placement._id,
      coverLetter: '',
      resumeLink: profile?.resumeLink || ''
    });
    setShowApplyModal(true);
  };

  const openViewModal = (placement) => {
    setCurrentPlacement(placement);
    setShowViewModal(true);
  };

  const openDeleteModal = (application) => {
    setCurrentApplication(application);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setApplicationForm({
      placementId: '',
      coverLetter: '',
      resumeLink: ''
    });
    setValidationErrors({});
  };

  const handleCloseModals = () => {
    setShowApplyModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setCurrentPlacement(null);
    setCurrentApplication(null);
    resetForm();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isDeadlineSoon = (deadlineDate) => {
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = Math.abs(deadline - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 3 && deadline > now;
  };

  const isDeadlinePassed = (deadlineDate) => {
    return new Date(deadlineDate) < new Date();
  };

  const getDeadlineText = (deadlineDate) => {
    if (isDeadlinePassed(deadlineDate)) {
      return (
        <span className="text-danger">
          <FaExclamationCircle className="me-1" /> Deadline passed ({formatDate(deadlineDate)})
        </span>
      );
    } else if (isDeadlineSoon(deadlineDate)) {
      return (
        <span className="text-warning">
          <FaClock className="me-1" /> Deadline soon: {formatDate(deadlineDate)}
        </span>
      );
    } else {
      return (
        <span>
          <FaCalendarAlt className="me-1" /> Apply by: {formatDate(deadlineDate)}
        </span>
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <Badge bg="success">Selected</Badge>;
      case 'Rejected':
        return <Badge bg="danger">Rejected</Badge>;
      case 'Under Review':
        return <Badge bg="warning">Under Review</Badge>;
      default:
        return <Badge bg="info">Applied</Badge>;
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getFilteredPlacements = () => {
    if (!placements) return [];

    switch (filter) {
      case 'active':
        return placements.filter(placement => placement.active && !isDeadlinePassed(placement.deadline));
      case 'deadline':
        return placements.filter(placement => 
          placement.active && isDeadlineSoon(placement.deadline) && !isDeadlinePassed(placement.deadline)
        );
      default:
        return placements.filter(placement => placement.active);
    }
  };

  const filteredPlacements = getFilteredPlacements();

  if (loading && placements.length === 0 && applications.length === 0) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="placement-container">
      {alertMessage.message && (
        <Alert variant={alertMessage.type} className="mb-4" dismissible onClose={() => setAlertMessage({ type: '', message: '' })}>
          {alertMessage.message}
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="openings" title={<><FaBriefcase className="me-2" /> Placement Opportunities</>}>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h5>Available Opportunities</h5>
            <div className="filter-buttons">
              <Button 
                variant={filter === 'all' ? 'primary' : 'outline-primary'} 
                size="sm" 
                onClick={() => handleFilterChange('all')}
                className="me-2"
              >
                All
              </Button>
              <Button 
                variant={filter === 'active' ? 'primary' : 'outline-primary'} 
                size="sm" 
                onClick={() => handleFilterChange('active')}
                className="me-2"
              >
                Active
              </Button>
              <Button 
                variant={filter === 'deadline' ? 'primary' : 'outline-primary'} 
                size="sm" 
                onClick={() => handleFilterChange('deadline')}
              >
                Deadline Soon
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : filteredPlacements.length === 0 ? (
            <Alert variant="info">
              No placement opportunities available at the moment.
            </Alert>
          ) : (
            <Row>
              {filteredPlacements.map(placement => (
                <Col md={6} lg={6} xl={4} key={placement._id} className="mb-4">
                  <Card className="placement-card h-100">
                    <Card.Body>
                      <div className="company-info">
                        <div className="company-logo">
                          <FaBuilding size={24} />
                        </div>
                        <div>
                          <p className="company-name">{placement.company}</p>
                          <Badge bg="secondary" className="me-2">{placement.type}</Badge>
                        </div>
                      </div>

                      <Card.Title>{placement.title}</Card.Title>
                      
                      <div className="placement-details">
                        <div className="detail-item">
                          <FaMapMarkerAlt className="detail-icon" />
                          <span>{placement.location}</span>
                        </div>
                        <div className="detail-item">
                          <FaMoneyBillWave className="detail-icon" />
                          <span>{placement.salary}</span>
                        </div>
                      </div>
                      
                      <div className={`deadline ${isDeadlineSoon(placement.deadline) ? 'urgent' : ''}`}>
                        {getDeadlineText(placement.deadline)}
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => openViewModal(placement)}
                        >
                          <FaEye className="me-1" /> View Details
                        </Button>
                        {placement.hasApplied ? (
                          <Badge bg="success">Applied</Badge>
                        ) : (
                          !isDeadlinePassed(placement.deadline) && (
                            <Button 
                              variant="primary" 
                              size="sm" 
                              onClick={() => openApplyModal(placement)}
                            >
                              <FaPaperPlane className="me-1" /> Apply
                            </Button>
                          )
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>
        
        <Tab eventKey="applications" title={<><FaClipboard className="me-2" /> My Applications</>}>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : applications.length === 0 ? (
            <Alert variant="info">
              You haven't applied to any placement opportunities yet.
            </Alert>
          ) : (
            <div>
              {applications.map(application => (
                <Card 
                  key={application._id} 
                  className={`application-card ${
                    application.status === 'Selected' 
                      ? 'selected' 
                      : application.status === 'Rejected'
                        ? 'rejected'
                        : application.status === 'Under Review'
                          ? 'under-review'
                          : ''
                  } mb-4`}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5>{application.placementId.title}</h5>
                        <div className="text-muted">{application.placementId.company}</div>
                      </div>
                      <div>
                        {getStatusBadge(application.status)}
                      </div>
                    </div>
                    
                    <div className="placement-details">
                      <div className="detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        <span>{application.placementId.location}</span>
                      </div>
                      <div className="detail-item">
                        <FaMoneyBillWave className="detail-icon" />
                        <span>{application.placementId.salary}</span>
                      </div>
                      <div className="detail-item">
                        <FaCalendarAlt className="detail-icon" />
                        <span>Applied on: {new Date(application.applicationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <Badge bg="light" text="dark" className="me-2">
                          {application.placementId.type}
                        </Badge>
                      </div>
                      
                      <div>
                        {(!isDeadlinePassed(application.placementId.deadline) && 
                          application.status === 'Applied') && (
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => openDeleteModal(application)}
                          >
                            Withdraw
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Tab>
      </Tabs>

      {/* Apply Modal */}
      <Modal show={showApplyModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPaperPlane className="me-2" /> Apply for Position
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPlacement && (
            <>
              <h5>{currentPlacement.title}</h5>
              <p className="text-muted">{currentPlacement.company} • {currentPlacement.location}</p>
              
              <div className="placement-form-divider" />

              <Form onSubmit={handleApply}>
                <Form.Group className="mb-3">
                  <Form.Label>Cover Letter</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="coverLetter"
                    value={applicationForm.coverLetter}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.coverLetter}
                    placeholder="Explain why you're a good fit for this position..."
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.coverLetter}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Resume Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="resumeLink"
                    value={applicationForm.resumeLink}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.resumeLink}
                    placeholder="Enter URL to your resume (Google Drive, Dropbox, etc.)"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.resumeLink}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Add a public link to your resume. You can update this in your profile section as well.
                  </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={handleCloseModals} className="me-2">
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit Application
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* View Placement Modal */}
      <Modal show={showViewModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaBuilding className="me-2" /> Placement Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPlacement && (
            <>
              <h4>{currentPlacement.title}</h4>
              <div className="company-info mb-3">
                <div className="company-logo">
                  <FaBuilding size={24} />
                </div>
                <div>
                  <p className="company-name mb-0">{currentPlacement.company}</p>
                  <small className="text-muted">{currentPlacement.location}</small>
                </div>
              </div>

              <div className="placement-form-divider" />

              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="detail-item">
                    <FaUserTie className="detail-icon" />
                    <span><strong>Type:</strong> {currentPlacement.type}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item">
                    <FaMoneyBillWave className="detail-icon" />
                    <span><strong>Salary:</strong> {currentPlacement.salary}</span>
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span><strong>Application Deadline:</strong> {formatDate(currentPlacement.deadline)}</span>
                  </div>
                </div>
              </div>

              <h5>Job Description</h5>
              <div className="mb-4 p-3 bg-light rounded">
                {currentPlacement.description.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <h5>Requirements</h5>
              <div className="mb-4 p-3 bg-light rounded">
                {currentPlacement.requirements.split('\n').map((requirement, idx) => (
                  <p key={idx}>{requirement}</p>
                ))}
              </div>

              {isDeadlinePassed(currentPlacement.deadline) ? (
                <Alert variant="warning">
                  <FaExclamationCircle className="me-2" /> 
                  Applications are closed for this placement opportunity.
                </Alert>
              ) : currentPlacement.hasApplied ? (
                <Alert variant="success">
                  <FaCheckCircle className="me-2" /> 
                  You have already applied for this position.
                </Alert>
              ) : null}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Close
          </Button>
          {currentPlacement && !isDeadlinePassed(currentPlacement.deadline) && !currentPlacement.hasApplied && (
            <Button variant="primary" onClick={() => {
              handleCloseModals();
              openApplyModal(currentPlacement);
            }}>
              <FaPaperPlane className="me-2" /> Apply Now
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Delete Application Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaTimesCircle className="me-2" /> Withdraw Application
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to withdraw your application for 
            <strong> {currentApplication?.placementId?.title}</strong> at 
            <strong> {currentApplication?.placementId?.company}</strong>?
          </p>
          <p className="text-muted">
            This action cannot be undone. You can reapply if the position is still open.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteApplication}>
            Withdraw Application
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentPlacements;