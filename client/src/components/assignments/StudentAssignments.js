import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Form, Row, Col, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import {
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaBookOpen,
  FaClipboard,
  FaFilter,
  FaInfoCircle,
  FaAngleLeft,
  FaAngleRight
} from 'react-icons/fa';

import CourseContext from '../../context/CourseContext';
import AssignmentContext from '../../context/AssignmentContext';

// CSS
import './Assignments.css';

const StudentAssignments = () => {
  const { courses, getCourses } = useContext(CourseContext);
  const {
    assignments,
    singleAssignment,
    loading,
    error,
    getAssignmentsByCourse,
    getAssignment
  } = useContext(AssignmentContext);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'overdue'
  const [filteredAssignments, setFilteredAssignments] = useState([]);

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

  useEffect(() => {
    filterAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments, filter]);

  const loadAssignments = async () => {
    if (selectedCourse) {
      await getAssignmentsByCourse(selectedCourse);
    }
  };

  const handleSelectCourse = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filterAssignments = () => {
    if (!assignments) {
      setFilteredAssignments([]);
      return;
    }

    let filtered;

    switch (filter) {
      case 'upcoming':
        filtered = assignments.filter(assignment => !isOverdue(assignment.dueDate));
        break;
      case 'overdue':
        filtered = assignments.filter(assignment => isOverdue(assignment.dueDate));
        break;
      default:
        filtered = [...assignments];
    }

    // Sort by due date (upcoming first)
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    setFilteredAssignments(filtered);
  };

  const viewAssignment = async (assignmentId) => {
    await getAssignment(assignmentId);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const formatDateTimeFromNow = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(date - now);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (date < now) {
      if (diffDays > 0) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    } else {
      if (diffDays > 0) {
        return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
      } else if (diffHours > 0) {
        return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
      } else {
        return 'Very soon';
      }
    }
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

  const getDueDateText = (dueDate) => {
    const formattedDate = formatDate(dueDate);
    const formattedTime = formatTime(dueDate);
    const fromNow = formatDateTimeFromNow(dueDate);
    
    if (isOverdue(dueDate)) {
      return (
        <span className="text-danger">
          <FaInfoCircle className="me-1" /> Due {formattedDate} ({fromNow})
        </span>
      );
    } else if (isDueSoon(dueDate)) {
      return (
        <span className="text-warning">
          <FaClock className="me-1" /> Due {formattedDate} ({fromNow})
        </span>
      );
    } else {
      return (
        <span>
          <FaCalendarAlt className="me-1" /> Due {formattedDate}
        </span>
      );
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
          <FaClipboard className="me-2" /> My Assignments
        </h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {courses.length === 0 ? (
        <Alert variant="info">
          You are not enrolled in any courses yet.
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

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>{getCurrentCourseName()}</h4>
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
                variant={filter === 'upcoming' ? 'primary' : 'outline-primary'} 
                size="sm" 
                onClick={() => handleFilterChange('upcoming')}
                className="me-2"
              >
                Upcoming
              </Button>
              <Button 
                variant={filter === 'overdue' ? 'primary' : 'outline-primary'} 
                size="sm" 
                onClick={() => handleFilterChange('overdue')}
              >
                Overdue
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="empty-state">
              <FaClipboard className="empty-state-icon mb-3" />
              <h5>No Assignments Found</h5>
              <p className="text-muted">
                {filter === 'all' 
                  ? 'There are no assignments for this course yet.'
                  : filter === 'upcoming'
                    ? 'There are no upcoming assignments for this course.'
                    : 'There are no overdue assignments for this course.'}
              </p>
            </div>
          ) : (
            <div className="assignments-list">
              {filteredAssignments.map(assignment => (
                <Card 
                  key={assignment._id} 
                  className={`assignment-card ${isOverdue(assignment.dueDate) ? 'overdue' : isDueSoon(assignment.dueDate) ? 'due-soon' : ''}`}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title>{assignment.title}</Card.Title>
                      {getDueDateLabel(assignment.dueDate)}
                    </div>
                    
                    <div className="due-date">
                      {getDueDateText(assignment.dueDate)}
                    </div>
                    
                    <Card.Text className="my-3">
                      {assignment.description.length > 150 
                        ? assignment.description.substring(0, 150) + '...' 
                        : assignment.description}
                    </Card.Text>
                    
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => viewAssignment(assignment._id)}
                      >
                        <FaEye className="me-1" /> View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* View Assignment Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {singleAssignment?.title || 'Assignment Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!singleAssignment ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Due Date</h6>
                    <div className={isOverdue(singleAssignment.dueDate) ? 'text-danger' : ''}>
                      <FaCalendarAlt className="me-2" />
                      {formatDate(singleAssignment.dueDate)} at {formatTime(singleAssignment.dueDate)}
                    </div>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Status</h6>
                    {isOverdue(singleAssignment.dueDate) ? (
                      <Badge bg="danger">Overdue</Badge>
                    ) : isDueSoon(singleAssignment.dueDate) ? (
                      <Badge bg="warning">Due Soon</Badge>
                    ) : (
                      <Badge bg="primary">Upcoming</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="assignment-form-divider" />

              <div className="mb-4">
                <h5>Instructions</h5>
                <div className="p-3 bg-light rounded assignment-description">
                  {singleAssignment.description}
                </div>
              </div>

              <div className="assignment-form-divider" />

              <div className="d-flex justify-content-between align-items-center text-muted">
                <small>
                  Created by: {singleAssignment.createdBy?.name || 'Teacher'}
                </small>
                <small>
                  Created: {new Date(singleAssignment.createdAt).toLocaleDateString()}
                </small>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentAssignments;