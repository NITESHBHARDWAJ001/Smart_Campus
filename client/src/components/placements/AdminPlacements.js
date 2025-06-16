import React, { useState, useEffect, useContext } from 'react';
import { Card, Badge, Button, Form, Row, Col, Alert, Spinner, Modal, Tabs, Tab, Table, ButtonGroup } from 'react-bootstrap';
import {
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClock,
  FaEye,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserGraduate,
  FaUserCheck,
  FaUserTimes,
  FaUserClock,
  FaToggleOn,
  FaToggleOff,
  FaInfoCircle,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaFileAlt,
  FaLink,
  FaExternalLinkAlt
} from 'react-icons/fa';

import PlacementContext from '../../context/PlacementContext';

// CSS
import './Placements.css';

const AdminPlacements = () => {
  const {
    placements,
    singlePlacement,
    applications,
    loading,
    error,
    getPlacements,
    getPlacement,
    createPlacement,
    updatePlacement,
    deletePlacement,
    togglePlacementActive,
    getPlacementApplications,
    updateApplicationStatus,
    getApplication
  } = useContext(PlacementContext);

  const [activeTab, setActiveTab] = useState('placements');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [currentPlacement, setCurrentPlacement] = useState(null);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [placementForm, setPlacementForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    deadline: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    await getPlacements();
  };

  const openAddModal = () => {
    setPlacementForm({
      title: '',
      company: '',
      location: '',
      salary: '',
      type: 'Full-time',
      description: '',
      requirements: '',
      deadline: getTomorrowDate()
    });
    setShowAddModal(true);
  };

  const openEditModal = (placement) => {
    setCurrentPlacement(placement);
    setPlacementForm({
      title: placement.title,
      company: placement.company,
      location: placement.location,
      salary: placement.salary,
      type: placement.type,
      description: placement.description,
      requirements: placement.requirements,
      deadline: formatDateForInput(new Date(placement.deadline))
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (placement) => {
    setCurrentPlacement(placement);
    setShowDeleteModal(true);
  };

  const openViewModal = async (placement) => {
    setCurrentPlacement(placement);
    setShowViewModal(true);
  };

  const openApplicantsModal = async (placement) => {
    setCurrentPlacement(placement);
    await getPlacementApplications(placement._id);
    setShowApplicantsModal(true);
  };

  const openApplicantModal = async (application) => {
    setCurrentApplication(application);
    setShowApplicantModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlacementForm({ ...placementForm, [name]: value });
    
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
    
    if (!placementForm.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!placementForm.company.trim()) {
      errors.company = 'Company name is required';
    }
    
    if (!placementForm.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!placementForm.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!placementForm.requirements.trim()) {
      errors.requirements = 'Requirements are required';
    }
    
    if (!placementForm.deadline) {
      errors.deadline = 'Application deadline is required';
    } else {
      const now = new Date();
      const deadline = new Date(placementForm.deadline);
      
      if (isNaN(deadline.getTime())) {
        errors.deadline = 'Please enter a valid date';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPlacement = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await createPlacement(placementForm);
      
      if (result.success) {
        setShowAddModal(false);
        resetForm();
        setAlertMessage({
          type: 'success',
          message: 'Placement opportunity added successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to add placement opportunity'
        });
      }
    } catch (error) {
      console.error('Error adding placement:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleEditPlacement = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await updatePlacement(currentPlacement._id, placementForm);
      
      if (result.success) {
        setShowEditModal(false);
        setCurrentPlacement(null);
        resetForm();
        setAlertMessage({
          type: 'success',
          message: 'Placement opportunity updated successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to update placement opportunity'
        });
      }
    } catch (error) {
      console.error('Error updating placement:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleDeletePlacement = async () => {
    try {
      const result = await deletePlacement(currentPlacement._id);
      
      if (result.success) {
        setShowDeleteModal(false);
        setCurrentPlacement(null);
        setAlertMessage({
          type: 'success',
          message: 'Placement opportunity deleted successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to delete placement opportunity'
        });
      }
    } catch (error) {
      console.error('Error deleting placement:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleToggleActive = async (placement) => {
    try {
      const result = await togglePlacementActive(placement._id);
      
      if (result.success) {
        setAlertMessage({
          type: 'success',
          message: `Placement opportunity ${result.placement.active ? 'activated' : 'deactivated'} successfully`
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to toggle placement status'
        });
      }
    } catch (error) {
      console.error('Error toggling placement status:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      const result = await updateApplicationStatus(applicationId, status);
      
      if (result.success) {
        setAlertMessage({
          type: 'success',
          message: `Application status updated to ${status}`
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
        
        // Refresh applications list if modal is open
        if (currentPlacement) {
          await getPlacementApplications(currentPlacement._id);
        }
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to update application status'
        });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const resetForm = () => {
    setPlacementForm({
      title: '',
      company: '',
      location: '',
      salary: '',
      type: 'Full-time',
      description: '',
      requirements: '',
      deadline: getTomorrowDate()
    });
    setValidationErrors({});
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowViewModal(false);
    setShowApplicantsModal(false);
    setShowApplicantModal(false);
    setCurrentPlacement(null);
    setCurrentApplication(null);
    resetForm();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateForInput(tomorrow);
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

  return (
    <div className="placement-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaBriefcase className="me-2" /> Placement Management
        </h2>
        <Button variant="primary" onClick={openAddModal}>
          <FaPlus className="me-1" /> Add New Opportunity
        </Button>
      </div>

      {alertMessage.message && (
        <Alert variant={alertMessage.type} className="mb-4" dismissible onClose={() => setAlertMessage({ type: '', message: '' })}>
          {alertMessage.message}
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : placements.length === 0 ? (
            <Alert variant="info">
              No placement opportunities available. Click "Add New Opportunity" to create one.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.map(placement => (
                    <tr key={placement._id}>
                      <td>{placement.title}</td>
                      <td>{placement.company}</td>
                      <td>{placement.location}</td>
                      <td>{placement.type}</td>
                      <td>
                        {isDeadlinePassed(placement.deadline) ? (
                          <span className="text-danger">{formatDate(placement.deadline)} (Passed)</span>
                        ) : isDeadlineSoon(placement.deadline) ? (
                          <span className="text-warning">{formatDate(placement.deadline)} (Soon)</span>
                        ) : (
                          formatDate(placement.deadline)
                        )}
                      </td>
                      <td>
                        {placement.active ? (
                          <Badge bg="success">Active</Badge>
                        ) : (
                          <Badge bg="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td>
                        <ButtonGroup size="sm">
                          <Button 
                            variant="outline-primary" 
                            onClick={() => openViewModal(placement)}
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            variant="outline-info" 
                            onClick={() => openApplicantsModal(placement)}
                            title="View Applicants"
                          >
                            <FaUserGraduate />
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            onClick={() => handleToggleActive(placement)}
                            title={placement.active ? "Deactivate" : "Activate"}
                          >
                            {placement.active ? <FaToggleOn /> : <FaToggleOff />}
                          </Button>
                          <Button 
                            variant="outline-success" 
                            onClick={() => openEditModal(placement)}
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            onClick={() => openDeleteModal(placement)}
                            title="Delete"
                          >
                            <FaTrash />
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>

      {/* Add Placement Modal */}
      <Modal show={showAddModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPlus className="me-2" /> Add New Placement Opportunity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddPlacement}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={placementForm.title}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.title}
                    placeholder="e.g., Software Engineer"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={placementForm.company}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.company}
                    placeholder="e.g., Tech Innovations Inc."
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.company}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={placementForm.location}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.location}
                    placeholder="e.g., New York, NY (Remote)"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.location}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Position Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={placementForm.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Salary/Stipend (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="salary"
                    value={placementForm.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., $60,000-$80,000/year or 'Not disclosed'"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Application Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={placementForm.deadline}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.deadline}
                    min={formatDateForInput(new Date())}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.deadline}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={placementForm.description}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.description}
                placeholder="Provide a detailed description of the role..."
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Requirements</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="requirements"
                value={placementForm.requirements}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.requirements}
                placeholder="List qualifications and skills needed..."
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.requirements}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModals} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Placement
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Placement Modal */}
      <Modal show={showEditModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" /> Edit Placement Opportunity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditPlacement}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={placementForm.title}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.title}
                    placeholder="e.g., Software Engineer"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={placementForm.company}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.company}
                    placeholder="e.g., Tech Innovations Inc."
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.company}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={placementForm.location}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.location}
                    placeholder="e.g., New York, NY (Remote)"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.location}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Position Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={placementForm.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Salary/Stipend (optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="salary"
                    value={placementForm.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., $60,000-$80,000/year or 'Not disclosed'"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Application Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    name="deadline"
                    value={placementForm.deadline}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.deadline}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.deadline}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={placementForm.description}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.description}
                placeholder="Provide a detailed description of the role..."
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Requirements</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="requirements"
                value={placementForm.requirements}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.requirements}
                placeholder="List qualifications and skills needed..."
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.requirements}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModals} className="me-2">
                Cancel
              </Button>
              <Button variant="success" type="submit">
                Update Placement
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Placement Modal */}
      <Modal show={showViewModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEye className="me-2" /> Placement Details
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
                    <FaBriefcase className="detail-icon" />
                    <span><strong>Type:</strong> {currentPlacement.type}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item">
                    <FaMoneyBillWave className="detail-icon" />
                    <span><strong>Salary:</strong> {currentPlacement.salary}</span>
                  </div>
                </div>
                <div className="col-md-6 mt-2">
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span><strong>Application Deadline:</strong> {formatDate(currentPlacement.deadline)}</span>
                  </div>
                </div>
                <div className="col-md-6 mt-2">
                  <div className="detail-item">
                    <FaToggleOn className="detail-icon" />
                    <span><strong>Status:</strong> {currentPlacement.active ? 'Active' : 'Inactive'}</span>
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

              <div className="text-end">
                <Button variant="primary" onClick={() => {
                  handleCloseModals();
                  openApplicantsModal(currentPlacement);
                }}>
                  <FaUserGraduate className="me-2" /> View Applicants
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Placement Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaTrash className="me-2" /> Delete Placement
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the placement opportunity 
            <strong> {currentPlacement?.title}</strong> at 
            <strong> {currentPlacement?.company}</strong>?
          </p>
          <p className="text-danger">
            <FaExclamationCircle className="me-1" /> This will also delete all applications associated with this placement.
          </p>
          <p className="text-muted">
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePlacement}>
            Delete Placement
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Applicants Modal */}
      <Modal show={showApplicantsModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserGraduate className="me-2" /> Applicants for {currentPlacement?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center my-3">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : applications.length === 0 ? (
            <Alert variant="info">
              No applications received for this placement opportunity yet.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(application => (
                    <tr key={application._id}>
                      <td>{application.studentId.name}</td>
                      <td>{application.studentId.department}</td>
                      <td>{new Date(application.applicationDate).toLocaleDateString()}</td>
                      <td>{getStatusBadge(application.status)}</td>
                      <td>
                        <ButtonGroup size="sm">
                          <Button 
                            variant="outline-primary" 
                            onClick={() => openApplicantModal(application)}
                          >
                            View Details
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Applicant Details Modal */}
      <Modal show={showApplicantModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserGraduate className="me-2" /> Application Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentApplication && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>{currentApplication.studentId.name}</h5>
                  <p className="text-muted mb-2">Roll Number: {currentApplication.studentId.rollNumber}</p>
                  <div className="detail-item mb-2">
                    <FaEnvelope className="detail-icon" />
                    <span>{currentApplication.studentId.email}</span>
                  </div>
                  <div className="detail-item mb-2">
                    <FaBuilding className="detail-icon" />
                    <span>{currentApplication.studentId.department}</span>
                  </div>
                </Col>
                <Col md={6} className="text-md-end">
                  <div className="mb-3">
                    <strong>Application Status:</strong> {getStatusBadge(currentApplication.status)}
                  </div>
                  <div className="mb-2">
                    <strong>Applied On:</strong> {new Date(currentApplication.applicationDate).toLocaleDateString()}
                  </div>
                </Col>
              </Row>

              <div className="placement-form-divider" />

              <h5>Cover Letter</h5>
              <div className="cover-letter-box">
                {currentApplication.coverLetter || "No cover letter provided."}
              </div>

              {currentApplication.resumeLink && (
                <div className="mt-4">
                  <h5>Resume</h5>
                  <Button 
                    variant="outline-primary" 
                    href={currentApplication.resumeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FaFileAlt className="me-2" /> View Resume <FaExternalLinkAlt size={12} className="ms-1" />
                  </Button>
                </div>
              )}

              <div className="placement-form-divider" />

              <h5>Update Application Status</h5>
              <div className="d-flex mt-3">
                <ButtonGroup>
                  <Button 
                    variant={currentApplication.status === 'Under Review' ? 'warning' : 'outline-warning'}
                    onClick={() => handleUpdateApplicationStatus(currentApplication._id, 'Under Review')}
                  >
                    <FaUserClock className="me-1" /> Under Review
                  </Button>
                  <Button 
                    variant={currentApplication.status === 'Selected' ? 'success' : 'outline-success'}
                    onClick={() => handleUpdateApplicationStatus(currentApplication._id, 'Selected')}
                  >
                    <FaUserCheck className="me-1" /> Select
                  </Button>
                  <Button 
                    variant={currentApplication.status === 'Rejected' ? 'danger' : 'outline-danger'}
                    onClick={() => handleUpdateApplicationStatus(currentApplication._id, 'Rejected')}
                  >
                    <FaUserTimes className="me-1" /> Reject
                  </Button>
                </ButtonGroup>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPlacements;