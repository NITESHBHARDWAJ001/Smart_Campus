import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Form, Row, Col, Modal, Alert, Spinner, Badge } from 'react-bootstrap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaLink, 
  FaFileAlt, 
  FaFileUpload, 
  FaBook,
  FaList
} from 'react-icons/fa';

import CourseContext from '../../context/CourseContext';
import MaterialContext from '../../context/MaterialContext';

// CSS
import './Materials.css';

const TeacherMaterials = () => {
  const { courses, getCourses } = useContext(CourseContext);
  const { 
    materials, 
    loading, 
    error, 
    getMaterialsByCourse, 
    createMaterial, 
    updateMaterial, 
    deleteMaterial 
  } = useContext(MaterialContext);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    content: '',
    type: 'text'
  });
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const loadCourses = async () => {
      await getCourses();
    };
    
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]._id);
    }
  }, [courses, selectedCourse]);

  useEffect(() => {
    if (selectedCourse) {
      getMaterialsByCourse(selectedCourse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  const validateForm = () => {
    const errors = {};
    
    if (!materialForm.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!materialForm.content.trim()) {
      errors.content = 'Content is required';
    } else if (materialForm.type === 'link') {
      try {
        new URL(materialForm.content);
      } catch (e) {
        errors.content = 'Please enter a valid URL';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSelectCourse = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleInputChange = (e) => {
    setMaterialForm({
      ...materialForm,
      [e.target.name]: e.target.value
    });
    
    // Clear validation error when field is edited
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: undefined
      });
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await createMaterial({
        courseId: selectedCourse,
        ...materialForm
      });
      
      if (result.success) {
        setShowAddModal(false);
        setMaterialForm({ title: '', content: '', type: 'text' });
        setAlertMessage({
          type: 'success',
          message: 'Material added successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to add material'
        });
      }
    } catch (error) {
      console.error('Error adding material:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleEditMaterial = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await updateMaterial(currentMaterial._id, materialForm);
      
      if (result.success) {
        setShowEditModal(false);
        setCurrentMaterial(null);
        setMaterialForm({ title: '', content: '', type: 'text' });
        setAlertMessage({
          type: 'success',
          message: 'Material updated successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to update material'
        });
      }
    } catch (error) {
      console.error('Error updating material:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleDeleteMaterial = async () => {
    try {
      const result = await deleteMaterial(currentMaterial._id);
      
      if (result.success) {
        setShowDeleteModal(false);
        setCurrentMaterial(null);
        setAlertMessage({
          type: 'success',
          message: 'Material deleted successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to delete material'
        });
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const openEditModal = (material) => {
    setCurrentMaterial(material);
    setMaterialForm({
      title: material.title,
      content: material.content,
      type: material.type
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (material) => {
    setCurrentMaterial(material);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setMaterialForm({ title: '', content: '', type: 'text' });
    setValidationErrors({});
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setCurrentMaterial(null);
    resetForm();
  };

  const renderMaterialIcon = (type) => {
    switch (type) {
      case 'link':
        return <FaLink className="me-2" />;
      case 'file':
        return <FaFileAlt className="me-2" />;
      default:
        return <FaFileAlt className="me-2" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'link':
        return <Badge bg="info">Link</Badge>;
      case 'file':
        return <Badge bg="secondary">File</Badge>;
      default:
        return <Badge bg="primary">Text</Badge>;
    }
  };

  const getCurrentCourseName = () => {
    if (!selectedCourse) return 'Select a Course';
    const course = courses.find(course => course._id === selectedCourse);
    return course ? course.name : 'Select a Course';
  };

  if (loading && courses.length === 0) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="materials-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaBook className="me-2" /> Course Materials
        </h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FaPlus className="me-1" /> Add Material
        </Button>
      </div>

      {alertMessage.message && (
        <Alert variant={alertMessage.type} className="mb-4" dismissible onClose={() => setAlertMessage({ type: '', message: '' })}>
          {alertMessage.message}
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {courses.length === 0 ? (
        <Alert variant="info">
          You haven't created any courses yet. Please create a course first.
        </Alert>
      ) : (
        <>
          <div className="course-selector mb-4">
            <Form.Group>
              <Form.Label>Select Course</Form.Label>
              <Form.Select value={selectedCourse || ''} onChange={handleSelectCourse}>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          <h4 className="mb-3">{getCurrentCourseName()}</h4>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : materials.length === 0 ? (
            <div className="empty-state p-5 text-center bg-light rounded">
              <FaFileUpload className="empty-state-icon mb-3" />
              <h5>No Materials Yet</h5>
              <p className="text-muted">
                Add your first material to this course by clicking the "Add Material" button.
              </p>
            </div>
          ) : (
            <div className="materials-list">
              <Row xs={1} md={2} className="g-4">
                {materials.map(material => (
                  <Col key={material._id}>
                    <Card className="material-card h-100">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            {renderMaterialIcon(material.type)}
                            <Card.Title className="d-inline">
                              {material.title}
                            </Card.Title>
                          </div>
                          <div>
                            {getTypeLabel(material.type)}
                          </div>
                        </div>
                        
                        <Card.Text className="mb-3">
                          {material.type === 'link' ? (
                            <a href={material.content} target="_blank" rel="noopener noreferrer">
                              {material.content}
                            </a>
                          ) : (
                            material.content.length > 200 
                              ? material.content.substring(0, 200) + '...' 
                              : material.content
                          )}
                        </Card.Text>
                        
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <small className="text-muted">
                            Added {new Date(material.createdAt).toLocaleDateString()}
                          </small>
                          <div className="btn-group">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => openEditModal(material)}
                            >
                              <FaEdit /> Edit
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => openDeleteModal(material)}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </>
      )}

      {/* Add Material Modal */}
      <Modal show={showAddModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPlus className="me-2" /> Add New Material
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMaterial}>
            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Select
                value={selectedCourse || ''}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={materialForm.title}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.title}
                placeholder="Enter material title"
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={materialForm.type}
                onChange={handleInputChange}
              >
                <option value="text">Text</option>
                <option value="link">External Link</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                {materialForm.type === 'link' ? 'URL' : 'Content'}
              </Form.Label>
              {materialForm.type === 'link' ? (
                <Form.Control
                  type="url"
                  name="content"
                  value={materialForm.content}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.content}
                  placeholder="https://example.com"
                  required
                />
              ) : (
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="content"
                  value={materialForm.content}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.content}
                  placeholder="Enter course material content"
                  required
                />
              )}
              <Form.Control.Feedback type="invalid">
                {validationErrors.content}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModals} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Material
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Material Modal */}
      <Modal show={showEditModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" /> Edit Material
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditMaterial}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={materialForm.title}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.title}
                placeholder="Enter material title"
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={materialForm.type}
                onChange={handleInputChange}
              >
                <option value="text">Text</option>
                <option value="link">External Link</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                {materialForm.type === 'link' ? 'URL' : 'Content'}
              </Form.Label>
              {materialForm.type === 'link' ? (
                <Form.Control
                  type="url"
                  name="content"
                  value={materialForm.content}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.content}
                  placeholder="https://example.com"
                  required
                />
              ) : (
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="content"
                  value={materialForm.content}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.content}
                  placeholder="Enter course material content"
                  required
                />
              )}
              <Form.Control.Feedback type="invalid">
                {validationErrors.content}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModals} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Material
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Material Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaTrash className="me-2" /> Delete Material
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete <strong>{currentMaterial?.title}</strong>?
          </p>
          <p className="text-muted">
            This action cannot be undone. Students will no longer have access to this material.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMaterial}>
            Delete Material
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeacherMaterials;