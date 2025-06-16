import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Row, Col, Alert, Spinner, Badge, Modal, Button } from 'react-bootstrap';
import { FaLink, FaFileAlt, FaBook, FaFileUpload, FaEye } from 'react-icons/fa';

import CourseContext from '../../context/CourseContext';
import MaterialContext from '../../context/MaterialContext';

// CSS
import './Materials.css';

const StudentMaterials = () => {
  const { courses, getCourses } = useContext(CourseContext);
  const { materials, loading, error, getMaterialsByCourse } = useContext(MaterialContext);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);

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

  const handleSelectCourse = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleViewMaterial = (material) => {
    setCurrentMaterial(material);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setCurrentMaterial(null);
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
              <h5>No Materials Available</h5>
              <p className="text-muted">
                Your teacher hasn't uploaded any materials for this course yet.
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
                        
                        <Card.Text className="mb-3 content-preview">
                          {material.type === 'link' ? (
                            <a href={material.content} target="_blank" rel="noopener noreferrer">
                              {material.content}
                            </a>
                          ) : (
                            material.content.length > 100 
                              ? material.content.substring(0, 100) + '...' 
                              : material.content
                          )}
                        </Card.Text>
                        
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <small className="text-muted">
                            Added {new Date(material.createdAt).toLocaleDateString()}
                          </small>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewMaterial(material)}
                          >
                            <FaEye /> View
                          </Button>
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

      {/* View Material Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {renderMaterialIcon(currentMaterial?.type)}
            {currentMaterial?.title}
            <span className="ms-2">{currentMaterial && getTypeLabel(currentMaterial.type)}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentMaterial?.type === 'link' ? (
            <div className="text-center">
              <p className="mb-4">
                <a 
                  href={currentMaterial.content} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="fs-5"
                >
                  {currentMaterial.content}
                </a>
              </p>
              <Button 
                variant="primary" 
                href={currentMaterial.content} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaLink className="me-2" /> Open Link
              </Button>
            </div>
          ) : (
            <div className="material-content">
              {currentMaterial?.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <small className="text-muted me-auto">
            Added on {currentMaterial && new Date(currentMaterial.createdAt).toLocaleDateString()}
          </small>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentMaterials;