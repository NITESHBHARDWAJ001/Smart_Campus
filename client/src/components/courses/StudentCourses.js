import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Badge, Spinner, Alert, Modal, Button } from 'react-bootstrap';
import { FaBook, FaChalkboardTeacher, FaInfoCircle } from 'react-icons/fa';
import CourseContext from '../../context/CourseContext';
import './Courses.css';

const StudentCourses = () => {
  const { courses, loading, error, getCourses, getCourse } = useContext(CourseContext);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    getCourses();
    // eslint-disable-next-line
  }, []);

  const handleShowDetails = async (courseId) => {
    // Get detailed course information
    const courseDetails = await getCourse(courseId);
    setSelectedCourse(courseDetails);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="courses-container mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaBook className="me-2" /> My Courses
        </h2>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {courses.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No Courses</Card.Title>
            <Card.Text>
              You're not enrolled in any courses yet. Your teacher will add you to your courses.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {courses.map(course => (
            <Col md={6} lg={4} key={course._id}>
              <Card className="course-card shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="icon-container mb-3">
                    <FaBook className="card-icon" />
                  </div>
                  <Card.Title className="text-center">{course.name}</Card.Title>
                  <div className="teacher-info">
                    <FaChalkboardTeacher className="me-2 text-primary" />
                    <small className="text-muted">
                      <span className="fw-bold">{course.teacher?.name}</span> (ID: {course.teacherId})
                    </small>
                  </div>
                  <Card.Text className="text-truncate mb-3">
                    {course.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <Badge bg="primary">
                      {course.students?.length || 0} Students
                    </Badge>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleShowDetails(course._id)}
                    >
                      <FaInfoCircle className="me-1" /> Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Course Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCourse?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && (
            <>
              <h6 className="mb-3">Course Details</h6>
              <p>{selectedCourse.description}</p>
              
              <div className="teacher-info mb-3">
                <h6>Teacher</h6>
                <p className="mb-1">
                  <strong>Name:</strong> {selectedCourse.teacher?.name}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {selectedCourse.teacher?.email}
                </p>
                <p className="mb-1">
                  <strong>Teacher ID:</strong> {selectedCourse.teacherId}
                </p>
              </div>
              
              <h6 className="mb-2">Classmates ({selectedCourse.students?.length || 0})</h6>
              <ul className="list-group">
                {selectedCourse.students && selectedCourse.students.length > 0 ? (
                  selectedCourse.students.map(student => (
                    <li key={student._id} className="list-group-item">
                      {student.name} ({student.rollNumber})
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No other students enrolled yet.</li>
                )}
              </ul>
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

export default StudentCourses;