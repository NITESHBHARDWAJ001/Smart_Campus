import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Button, Modal, Form, Table, Alert, Spinner } from 'react-bootstrap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUserPlus, 
  FaBook, 
  FaSearch, 
  FaUserGraduate, 
  FaUserMinus 
} from 'react-icons/fa';
import CourseContext from '../../context/CourseContext';
import './Courses.css';

const TeacherCourses = () => {
  const { courses, loading, error, getCourses, createCourse, updateCourse, deleteCourse, addStudent, removeStudent } = useContext(CourseContext);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: '', description: '' });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [rollNumber, setRollNumber] = useState('');
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    getCourses();
    // eslint-disable-next-line
  }, []);

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowAddStudentModal(false);
    setShowStudentsModal(false);
    setSelectedCourse(null);
    setCourseForm({ name: '', description: '' });
    setRollNumber('');
  };

  const handleOpenEditModal = (course) => {
    setSelectedCourse(course);
    setCourseForm({ name: course.name, description: course.description });
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleOpenAddStudentModal = (course) => {
    setSelectedCourse(course);
    setShowAddStudentModal(true);
  };

  const handleOpenStudentsModal = (course) => {
    setSelectedCourse(course);
    setShowStudentsModal(true);
  };

  const handleInputChange = (e) => {
    setCourseForm({
      ...courseForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    
    if (!courseForm.name || !courseForm.description) {
      setAlertMessage({
        type: 'danger',
        message: 'Please fill all fields'
      });
      return;
    }

    const res = await createCourse(courseForm);
    
    if (res.success) {
      handleCloseModals();
      setAlertMessage({
        type: 'success',
        message: 'Course created successfully'
      });
      setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
    } else {
      setAlertMessage({
        type: 'danger',
        message: res.message
      });
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    
    if (!courseForm.name || !courseForm.description) {
      setAlertMessage({
        type: 'danger',
        message: 'Please fill all fields'
      });
      return;
    }

    const res = await updateCourse(selectedCourse._id, courseForm);
    
    if (res.success) {
      handleCloseModals();
      setAlertMessage({
        type: 'success',
        message: 'Course updated successfully'
      });
      setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
    } else {
      setAlertMessage({
        type: 'danger',
        message: res.message
      });
    }
  };

  const handleDeleteCourse = async () => {
    const res = await deleteCourse(selectedCourse._id);
    
    if (res.success) {
      handleCloseModals();
      setAlertMessage({
        type: 'success',
        message: 'Course deleted successfully'
      });
      setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
    } else {
      setAlertMessage({
        type: 'danger',
        message: res.message
      });
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    if (!rollNumber) {
      setAlertMessage({
        type: 'danger',
        message: 'Please enter a roll number'
      });
      return;
    }

    const res = await addStudent(selectedCourse._id, rollNumber);
    
    if (res.success) {
      setRollNumber('');
      setAlertMessage({
        type: 'success',
        message: 'Student added successfully'
      });
      setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
    } else {
      setAlertMessage({
        type: 'danger',
        message: res.message
      });
    }
  };

  const handleRemoveStudent = async (studentId) => {
    const res = await removeStudent(selectedCourse._id, studentId);
    
    if (res.success) {
      setAlertMessage({
        type: 'success',
        message: 'Student removed successfully'
      });
      setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
    } else {
      setAlertMessage({
        type: 'danger',
        message: res.message
      });
    }
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
    <div className="course-management mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaBook className="me-2" /> My Courses
        </h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <FaPlus className="me-2" /> Create Course
        </Button>
      </div>

      {alertMessage.message && (
        <Alert variant={alertMessage.type} className="mb-4" onClose={() => setAlertMessage({ type: '', message: '' })} dismissible>
          {alertMessage.message}
        </Alert>
      )}

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {courses.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>No Courses Yet</Card.Title>
            <Card.Text>
              You haven't created any courses yet. Click the 'Create Course' button to get started.
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
                  <Card.Text className="mb-3 text-truncate">
                    {course.description}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleOpenStudentsModal(course)}
                      >
                        <FaUserGraduate className="me-1" /> {course.students?.length || 0} Students
                      </Button>
                      <div>
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleOpenAddStudentModal(course)}
                          title="Add Student"
                        >
                          <FaUserPlus />
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleOpenEditModal(course)}
                          title="Edit Course"
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleOpenDeleteModal(course)}
                          title="Delete Course"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Course Modal */}
      <Modal show={showCreateModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title><FaPlus className="me-2" /> Create New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateCourse}>
            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={courseForm.name}
                onChange={handleInputChange}
                placeholder="Enter course name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={courseForm.description}
                onChange={handleInputChange}
                placeholder="Enter course description"
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModals}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Course
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Course Modal */}
      <Modal show={showEditModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title><FaEdit className="me-2" /> Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateCourse}>
            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={courseForm.name}
                onChange={handleInputChange}
                placeholder="Enter course name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={courseForm.description}
                onChange={handleInputChange}
                placeholder="Enter course description"
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModals}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Course
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Course Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger"><FaTrash className="me-2" /> Delete Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>{selectedCourse?.name}</strong>?</p>
          <p>This action cannot be undone, and all student enrollments will be lost.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCourse}>
            Delete Course
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Student Modal */}
      <Modal show={showAddStudentModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title><FaUserPlus className="me-2" /> Add Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddStudent}>
            <Form.Group className="mb-3">
              <Form.Label>Student Roll Number</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter student roll number"
                  required
                />
                <Button variant="outline-secondary" type="submit">
                  <FaSearch /> Search & Add
                </Button>
              </div>
              <Form.Text className="text-muted">
                Enter the student's roll number to add them to this course.
              </Form.Text>
            </Form.Group>
          </Form>

          {/* List of currently enrolled students */}
          {selectedCourse && selectedCourse.students && selectedCourse.students.length > 0 && (
            <div className="mt-4">
              <h6>Currently Enrolled Students</h6>
              <Table responsive className="mt-2">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCourse.students.map(student => (
                    <tr key={student._id}>
                      <td>{student.rollNumber}</td>
                      <td>{student.name}</td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleRemoveStudent(student._id)}
                        >
                          <FaUserMinus /> Remove
                        </Button>
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
            Done
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Students Modal */}
      <Modal show={showStudentsModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserGraduate className="me-2" /> 
            Students Enrolled in {selectedCourse?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && selectedCourse.students && selectedCourse.students.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.students.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleRemoveStudent(student._id)}
                      >
                        <FaUserMinus /> Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center py-3">No students enrolled in this course yet.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            handleCloseModals();
            handleOpenAddStudentModal(selectedCourse);
          }}>
            <FaUserPlus className="me-1" /> Add Students
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeacherCourses;