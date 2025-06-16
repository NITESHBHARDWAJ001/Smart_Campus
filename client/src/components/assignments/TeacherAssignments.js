import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Form, Row, Col, Alert, Spinner, Modal } from 'react-bootstrap';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaBookOpen,
  FaClipboard,
  FaChalkboardTeacher,
  FaExclamationCircle
} from 'react-icons/fa';

import CourseContext from '../../context/CourseContext';
import AssignmentContext from '../../context/AssignmentContext';

// CSS
import './Assignments.css';

const TeacherAssignments = () => {
  const { courses, getCourses } = useContext(CourseContext);
  const {
    assignments,
    loading,
    error,
    getAssignmentsByCourse,
    createAssignment,
    updateAssignment,
    deleteAssignment
  } = useContext(AssignmentContext);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    courseId: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    const loadCourses = async () => {
      await getCourses();
    };
    
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]?._id);
    }
  }, [courses, selectedCourse]);

  useEffect(() => {
    if (selectedCourse) {
      loadAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  const loadAssignments = async () => {
    if (selectedCourse) {
      await getAssignmentsByCourse(selectedCourse);
    }
  };

  const handleSelectCourse = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentForm({ ...assignmentForm, [name]: value });
    
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
    
    if (!assignmentForm.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!assignmentForm.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!assignmentForm.dueDate) {
      errors.dueDate = 'Due date is required';
    } else {
      const now = new Date();
      const dueDate = new Date(assignmentForm.dueDate);
      
      // Make sure the date is valid
      if (isNaN(dueDate.getTime())) {
        errors.dueDate = 'Please enter a valid date';
      }
    }
    
    if (!assignmentForm.courseId) {
      errors.courseId = 'Course is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await createAssignment(assignmentForm);
      
      if (result.success) {
        setShowAddModal(false);
        resetForm();
        setAlertMessage({
          type: 'success',
          message: 'Assignment added successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to add assignment'
        });
      }
    } catch (error) {
      console.error('Error adding assignment:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleEditAssignment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await updateAssignment(currentAssignment._id, {
        title: assignmentForm.title,
        description: assignmentForm.description,
        dueDate: assignmentForm.dueDate
      });
      
      if (result.success) {
        setShowEditModal(false);
        setCurrentAssignment(null);
        resetForm();
        setAlertMessage({
          type: 'success',
          message: 'Assignment updated successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to update assignment'
        });
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleDeleteAssignment = async () => {
    try {
      const result = await deleteAssignment(currentAssignment._id);
      
      if (result.success) {
        setShowDeleteModal(false);
        setCurrentAssignment(null);
        setAlertMessage({
          type: 'success',
          message: 'Assignment deleted successfully'
        });
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to delete assignment'
        });
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const openAddModal = () => {
    setAssignmentForm({
      title: '',
      description: '',
      dueDate: getTomorrowDate(),
      courseId: selectedCourse
    });
    setShowAddModal(true);
  };

  const openEditModal = (assignment) => {
    setCurrentAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: formatDateForInput(new Date(assignment.dueDate)),
      courseId: assignment.courseId
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (assignment) => {
    setCurrentAssignment(assignment);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setAssignmentForm({
      title: '',
      description: '',
      dueDate: '',
      courseId: selectedCourse || ''
    });
    setValidationErrors({});
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setCurrentAssignment(null);
    resetForm();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateForInput(tomorrow);
  };

  const isDueSoon = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(due - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 3 && due > now;
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDueDateLabel = (dueDate) => {
    if (isOverdue(dueDate)) {
      return <span className="date-label overdue">Overdue</span>;
    } else if (isDueSoon(dueDate)) {
      return <span className="date-label due-soon">Due Soon</span>;
    } else {
      return <span className="date-label upcoming">Upcoming</span>;
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
    <div className="assignments-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaClipboard className="me-2" /> Course Assignments
        </h2>
        <Button variant="primary" onClick={openAddModal}>
          <FaPlus className="me-1" /> Add Assignment
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
          ) : assignments.length === 0 ? (
            <div className="empty-state">
              <FaClipboard className="empty-state-icon mb-3" />
              <h5>No Assignments Yet</h5>
              <p className="text-muted">
                Create your first assignment for this course by clicking the "Add Assignment" button.
              </p>
            </div>
          ) : (
            <div className="assignments-list">
              {assignments.map(assignment => (
                <Card 
                  key={assignment._id} 
                  className={`assignment-card ${isOverdue(assignment.dueDate) ? 'overdue' : isDueSoon(assignment.dueDate) ? 'due-soon' : ''}`}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title>{assignment.title}</Card.Title>
                      {getDueDateLabel(assignment.dueDate)}
                    </div>
                    
                    <div className={`due-date ${isOverdue(assignment.dueDate) ? 'text-danger' : ''}`}>
                      <FaCalendarAlt className="me-1" /> Due: {formatDate(assignment.dueDate)} at {formatTime(assignment.dueDate)}
                    </div>
                    
                    <Card.Text className="assignment-description">
                      {assignment.description.length > 200 
                        ? assignment.description.substring(0, 200) + '...' 
                        : assignment.description}
                    </Card.Text>
                    
                    <div className="d-flex justify-content-between align-items-center assignment-actions">
                      <small className="text-muted">
                        Created {new Date(assignment.createdAt).toLocaleDateString()}
                      </small>
                      <div className="btn-group">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => openEditModal(assignment)}
                        >
                          <FaEdit className="me-1" /> Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => openDeleteModal(assignment)}
                        >
                          <FaTrash className="me-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Assignment Modal */}
      <Modal show={showAddModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPlus className="me-2" /> Add New Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAssignment}>
            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Select
                name="courseId"
                value={assignmentForm.courseId || ''}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.courseId}
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.courseId}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assignment Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={assignmentForm.title}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.title}
                placeholder="Enter assignment title"
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={assignmentForm.dueDate}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.dueDate}
                min={formatDateForInput(new Date())}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.dueDate}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={assignmentForm.description}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.description}
                placeholder="Enter assignment description, instructions, requirements, etc."
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModals} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Assignment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Assignment Modal */}
      <Modal show={showEditModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" /> Edit Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditAssignment}>
            <Form.Group className="mb-3">
              <Form.Label>Assignment Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={assignmentForm.title}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.title}
                placeholder="Enter assignment title"
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={assignmentForm.dueDate}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.dueDate}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.dueDate}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={assignmentForm.description}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.description}
                placeholder="Enter assignment description"
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModals} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Assignment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Assignment Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FaTrash className="me-2" /> Delete Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the assignment <strong>{currentAssignment?.title}</strong>?
          </p>
          <p className="text-muted">
            This action cannot be undone. Students will no longer be able to view this assignment.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAssignment}>
            Delete Assignment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeacherAssignments;