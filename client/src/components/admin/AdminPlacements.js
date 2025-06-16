import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Badge, Row, Col, Card, Form, Pagination, Modal, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { FaTrash, FaEdit, FaEye, FaPlus, FaSearch, FaUsers, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import AdminContext from '../../context/AdminContext';
import PlacementContext from '../../context/PlacementContext';

const AdminPlacements = () => {
  const { adminPlacements, loading, error, pagination, getAdminPlacements } = useContext(AdminContext);
  const { 
    getPlacementApplications, 
    togglePlacementActive, 
    deletePlacement, 
    applications, 
    createPlacement
  } = useContext(PlacementContext);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [placementToDelete, setPlacementToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [showNewPlacementModal, setShowNewPlacementModal] = useState(false);
  const [newPlacement, setNewPlacement] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: 'Full-time',
    salary: '',
    requirements: '',
    deadline: '',
    active: true
  });

  useEffect(() => {
    loadPlacements();
    // eslint-disable-next-line
  }, [currentPage, activeFilter]);

  const loadPlacements = async () => {
    try {
      const filters = {};
      if (activeFilter !== '') filters.active = activeFilter;
      if (searchTerm) filters.search = searchTerm;
      
      console.log('Loading placements with filters:', filters);
      const result = await getAdminPlacements(currentPage, 10, filters);
      console.log('Loaded admin placements result:', result);
      
      // If we didn't get any placements, try loading all placements
      if (!result || !result.data || result.data.length === 0) {
        console.log('No placements found with filters, trying to load all placements');
        await getAdminPlacements(1, 50, {});
      }
    } catch (error) {
      console.error('Error loading placements:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    loadPlacements();
  };

  const handleDeleteClick = (placement) => {
    setPlacementToDelete(placement);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (placementToDelete) {
      const result = await deletePlacement(placementToDelete._id);
      setShowDeleteModal(false);
      
      if (result.success) {
        setAlertVariant('success');
        setAlertMessage(`Placement "${placementToDelete.title}" deleted successfully.`);
      } else {
        setAlertVariant('danger');
        setAlertMessage(`Error: ${result.message || 'Could not delete placement.'}`);
      }
      
      setShowAlert(true);
      // If we deleted the last placement on the current page, go to previous page
      if (adminPlacements && adminPlacements.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        loadPlacements();
      }
    }
  };
  
  // New Placement Handler
  const handleNewPlacementChange = (e) => {
    const { name, value } = e.target;
    setNewPlacement({
      ...newPlacement,
      [name]: value
    });
  };

  const handleNewPlacementSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate the form
      if (!newPlacement.title || !newPlacement.company || !newPlacement.description || 
          !newPlacement.location || !newPlacement.deadline || !newPlacement.requirements) {
        setAlertVariant('danger');
        setAlertMessage('Please fill all required fields');
        setShowAlert(true);
        return;
      }

      // Format the data before sending to API - excluding createdBy as the server will handle this
      const formattedPlacement = {
        title: newPlacement.title,
        company: newPlacement.company,
        description: newPlacement.description,
        location: newPlacement.location,
        type: newPlacement.type,
        salary: newPlacement.salary,
        requirements: newPlacement.requirements,
        active: newPlacement.active,
        // Ensure deadline is a proper ISO string if it's a date input
        deadline: new Date(newPlacement.deadline).toISOString()
      };

      console.log('Submitting placement data:', formattedPlacement);

      // Call the createPlacement API
      const result = await createPlacement(formattedPlacement);
      console.log('Create placement result:', result);
      
      setShowNewPlacementModal(false);
      
      if (result && result.success) {
        setAlertVariant('success');
        setAlertMessage(`New placement "${newPlacement.title}" created successfully.`);
        
        // Reset form
        setNewPlacement({
          title: '',
          company: '',
          description: '',
          location: '',
          type: 'Full-time',
          salary: '',
          requirements: '',
          deadline: '',
          active: true
        });
        
        // Reload placements and refresh page with delay to allow server processing
        setTimeout(() => {
          loadPlacements();
        }, 1000);
      } else {
        setAlertVariant('danger');
        setAlertMessage(`Error: ${result?.message || 'Could not create placement.'}`);
      }
      
      setShowAlert(true);
    } catch (error) {
      console.error('Error creating placement:', error);
      setAlertVariant('danger');
      setAlertMessage(`Error: ${error.message || 'Could not create placement.'}`);
      setShowAlert(true);
    }
  };

  const handleToggleActive = async (placement) => {
    const result = await togglePlacementActive(placement._id);
    
    if (result.success) {
      setAlertVariant('success');
      setAlertMessage(`Placement status updated successfully.`);
      loadPlacements();
    } else {
      setAlertVariant('danger');
      setAlertMessage(`Error: ${result.message || 'Could not update placement status.'}`);
    }
    
    setShowAlert(true);
  };

  const handleViewApplications = async (placement) => {
    setSelectedPlacement(placement);
    setShowApplicationsModal(true);
    setApplicationsLoading(true);
    
    await getPlacementApplications(placement._id);
    setApplicationsLoading(false);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxPages = pagination?.totalPages || 1;
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );
    
    // First page
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );
    
    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
    }
    
    // Pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(maxPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < maxPages) {
        items.push(
          <Pagination.Item
            key={i}
            active={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }
    
    // Ellipsis if needed
    if (currentPage < maxPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
    }
    
    // Last page
    if (maxPages > 1) {
      items.push(
        <Pagination.Item
          key={maxPages}
          active={currentPage === maxPages}
          onClick={() => handlePageChange(maxPages)}
        >
          {maxPages}
        </Pagination.Item>
      );
    }
    
    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === maxPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );
    
    return items;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return <Badge bg="primary">Applied</Badge>;
      case 'Under Review':
        return <Badge bg="warning">Under Review</Badge>;
      case 'Selected':
        return <Badge bg="success">Selected</Badge>;
      case 'Rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getApplicationStatusButtons = (application) => {
    return (
      <>
        <Button 
          variant={application.status === 'Under Review' ? 'warning' : 'outline-warning'} 
          size="sm" 
          className="me-1"
          disabled={application.status === 'Under Review'}
          onClick={() => handleUpdateApplicationStatus(application, 'Under Review')}
        >
          Review
        </Button>
        <Button 
          variant={application.status === 'Selected' ? 'success' : 'outline-success'} 
          size="sm" 
          className="me-1"
          disabled={application.status === 'Selected'}
          onClick={() => handleUpdateApplicationStatus(application, 'Selected')}
        >
          Select
        </Button>
        <Button 
          variant={application.status === 'Rejected' ? 'danger' : 'outline-danger'} 
          size="sm"
          disabled={application.status === 'Rejected'}
          onClick={() => handleUpdateApplicationStatus(application, 'Rejected')}
        >
          Reject
        </Button>
      </>
    );
  };

  const handleUpdateApplicationStatus = async (application, status) => {
    try {
      // This will be available in the PlacementContext
      // await updateApplicationStatus(application._id, status);
      
      setAlertVariant('success');
      setAlertMessage(`Application status updated to ${status}.`);
      
      // Refresh the applications
      if (selectedPlacement) {
        await getPlacementApplications(selectedPlacement._id);
      }
    } catch (error) {
      setAlertVariant('danger');
      setAlertMessage(`Error: Could not update application status.`);
    }
    
    setShowAlert(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDatePassed = (dateString) => {
    const today = new Date();
    const deadline = new Date(dateString);
    return today > deadline;
  };

  return (
    <div>
      {showAlert && (
        <Alert 
          variant={alertVariant} 
          onClose={() => setShowAlert(false)} 
          dismissible
        >
          {alertMessage}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={4}>
              <Form onSubmit={handleSearch}>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Search placements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    <FaSearch /> Search
                  </Button>
                </div>
              </Form>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Select
                  value={activeFilter}
                  onChange={(e) => {
                    setActiveFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5} className="text-md-end">
              <Button variant="success" onClick={() => setShowNewPlacementModal(true)}>
                <FaPlus className="me-1" /> New Placement
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">
          {error}
        </Alert>
      ) : !adminPlacements || adminPlacements.length === 0 ? (
        <Alert variant="info">
          No placements found. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <Card>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Deadline</th>
                      <th>Applications</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminPlacements && adminPlacements.map((placement) => (
                      <tr key={placement._id}>
                        <td>{placement.title}</td>
                        <td>{placement.company}</td>
                        <td>{placement.location}</td>
                        <td>{placement.type}</td>
                        <td>
                          <span className={isDatePassed(placement.deadline) ? 'text-danger' : ''}>
                            {formatDate(placement.deadline)}
                          </span>
                        </td>
                        <td>
                          <Badge bg="secondary" pill>
                            {placement.applications} Applications
                          </Badge>
                          {placement.selected > 0 && (
                            <Badge bg="success" pill className="ms-1">
                              {placement.selected} Selected
                            </Badge>
                          )}
                        </td>
                        <td>
                          {placement.active ? 
                            <Badge bg="success">Active</Badge> : 
                            <Badge bg="secondary">Inactive</Badge>
                          }
                        </td>
                        <td className="text-center">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleViewApplications(placement)}
                          >
                            <FaUsers />
                          </Button>
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            className="me-1"
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            className="me-1"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleToggleActive(placement)}
                          >
                            {placement.active ? <FaToggleOn /> : <FaToggleOff />}
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteClick(placement)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer>
              <Row className="align-items-center">
                <Col className="col">
                  <small className="text-muted">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination?.total || 0)} of {pagination?.total || 0} placements
                  </small>
                </Col>
                <Col className="col-auto">
                  <Pagination className="mb-0">
                    {renderPaginationItems()}
                  </Pagination>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the placement "{placementToDelete?.title}"? This will also delete all associated applications. This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Placement
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Applications Modal */}
      <Modal 
        show={showApplicationsModal} 
        onHide={() => setShowApplicationsModal(false)}
        size="xl"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Applications for {selectedPlacement?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {applicationsLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : applications && applications.length > 0 ? (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.filter(app => app).map((app) => (
                  <tr key={app._id}>
                    <td>{app.studentId?.name || '-'}</td>
                    <td>{app.studentId?.email || '-'}</td>
                    <td>{app.studentId?.department || '-'}</td>
                    <td>{app.applicationDate ? formatDate(app.applicationDate) : '-'}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <Tabs defaultActiveKey="actions" className="mb-3">
                        <Tab eventKey="actions" title="Actions" className="pt-3">
                          {getApplicationStatusButtons(app)}
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            className="ms-2"
                          >
                            <FaEye /> Details
                          </Button>
                        </Tab>
                        <Tab eventKey="cover" title="Cover Letter" className="pt-3">
                          <div className="border rounded p-3 bg-light">
                            <p className="mb-0">{app.coverLetter || 'No cover letter provided.'}</p>
                          </div>
                        </Tab>
                        <Tab eventKey="resume" title="Resume" className="pt-3">
                          <div className="border rounded p-3 bg-light">
                            {app.resumeLink ? (
                              <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                                View Resume
                              </a>
                            ) : (
                              <p className="mb-0">No resume link provided.</p>
                            )}
                          </div>
                        </Tab>
                      </Tabs>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">
              No applications found for this placement.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApplicationsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* New Placement Modal */}
      <Modal 
        show={showNewPlacementModal} 
        onHide={() => setShowNewPlacementModal(false)}
        size="lg"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Placement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNewPlacementSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title*</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="title" 
                    value={newPlacement.title}
                    onChange={handleNewPlacementChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company*</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="company" 
                    value={newPlacement.company}
                    onChange={handleNewPlacementChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description*</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="description" 
                value={newPlacement.description}
                onChange={handleNewPlacementChange}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location*</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="location" 
                    value={newPlacement.location}
                    onChange={handleNewPlacementChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type*</Form.Label>
                  <Form.Select 
                    name="type" 
                    value={newPlacement.type}
                    onChange={handleNewPlacementChange}
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

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Salary (Optional)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="salary" 
                    value={newPlacement.salary}
                    onChange={handleNewPlacementChange}
                    placeholder="e.g. $70,000-$90,000/year or $25/hour"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Application Deadline*</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="deadline" 
                    value={newPlacement.deadline}
                    onChange={handleNewPlacementChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Requirements*</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="requirements" 
                value={newPlacement.requirements}
                onChange={handleNewPlacementChange}
                required
                placeholder="List qualifications, skills, education requirements, etc."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Active" 
                name="active" 
                checked={newPlacement.active}
                onChange={(e) => setNewPlacement({
                  ...newPlacement,
                  active: e.target.checked
                })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewPlacementModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleNewPlacementSubmit}>
            Create Placement
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPlacements;