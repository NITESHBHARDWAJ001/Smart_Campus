import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Table, Alert, Spinner, Badge, 
         Row, Col, ProgressBar } from 'react-bootstrap';
import { 
  FaCalendarCheck, 
  FaChartBar, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

import AuthContext from '../../context/AuthContext';
import CourseContext from '../../context/CourseContext';
import AttendanceContext from '../../context/AttendanceContext';

// CSS
import './Attendance.css';

const StudentAttendance = () => {
  const { user } = useContext(AuthContext);
  const { courses, getCourses } = useContext(CourseContext);
  const { 
    loading,
    error, 
    getAttendanceByCourse,
    getStudentAttendanceStats,
    attendanceRecords,
    studentAttendanceStats
  } = useContext(AttendanceContext);

  const [selectedCourse, setSelectedCourse] = useState(null);

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
    if (selectedCourse && user) {
      loadAttendanceData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse, user]);

  const loadAttendanceData = async () => {
    await getAttendanceByCourse(selectedCourse);
    await getStudentAttendanceStats(selectedCourse, user._id);
  };

  const handleSelectCourse = (e) => {
    setSelectedCourse(e.target.value);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return <Badge bg="success">Present</Badge>;
      case 'absent':
        return <Badge bg="danger">Absent</Badge>;
      case 'late':
        return <Badge bg="warning">Late</Badge>;
      case 'excused':
        return <Badge bg="info">Excused</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getCurrentCourseName = () => {
    if (!selectedCourse) return 'Select a Course';
    const course = courses.find(course => course._id === selectedCourse);
    return course ? course.name : 'Select a Course';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'present':
        return 'present';
      case 'absent':
        return 'absent';
      case 'late':
        return 'late';
      case 'excused':
        return 'excused';
      default:
        return '';
    }
  };

  const getAttendanceVariant = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 60) return 'warning';
    return 'danger';
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
    <div className="attendance-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaCalendarCheck className="me-2" /> My Attendance
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

          <h4 className="mb-4">{getCurrentCourseName()}</h4>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {studentAttendanceStats && (
                <div className="attendance-summary mb-4">
                  <Row>
                    <Col lg={8}>
                      <Card className="mb-4 shadow-sm">
                        <Card.Header className="bg-light">
                          <h5 className="mb-0">
                            <FaChartBar className="me-2" /> Attendance Overview
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0">Attendance Rate</h6>
                              <span 
                                className={`attendance-percentage text-${
                                  getAttendanceVariant(studentAttendanceStats.attendancePercentage)
                                }`}
                              >
                                {studentAttendanceStats.attendancePercentage}%
                              </span>
                            </div>
                            <ProgressBar 
                              now={studentAttendanceStats.attendancePercentage} 
                              variant={getAttendanceVariant(studentAttendanceStats.attendancePercentage)}
                              style={{ height: '10px' }}
                            />
                          </div>

                          <Row>
                            <Col sm={6} md={3} className="mb-3">
                              <div className="text-center px-3 py-2 border rounded bg-light">
                                <div className="text-success h4 mb-1">
                                  <FaCheckCircle />
                                </div>
                                <div className="text-success h4 mb-1">
                                  {studentAttendanceStats.present}
                                </div>
                                <div className="small text-muted">Present</div>
                              </div>
                            </Col>
                            <Col sm={6} md={3} className="mb-3">
                              <div className="text-center px-3 py-2 border rounded bg-light">
                                <div className="text-danger h4 mb-1">
                                  <FaTimesCircle />
                                </div>
                                <div className="text-danger h4 mb-1">
                                  {studentAttendanceStats.absent}
                                </div>
                                <div className="small text-muted">Absent</div>
                              </div>
                            </Col>
                            <Col sm={6} md={3} className="mb-3">
                              <div className="text-center px-3 py-2 border rounded bg-light">
                                <div className="text-warning h4 mb-1">
                                  <FaCalendarAlt />
                                </div>
                                <div className="text-warning h4 mb-1">
                                  {studentAttendanceStats.late}
                                </div>
                                <div className="small text-muted">Late</div>
                              </div>
                            </Col>
                            <Col sm={6} md={3} className="mb-3">
                              <div className="text-center px-3 py-2 border rounded bg-light">
                                <div className="text-info h4 mb-1">
                                  <FaExclamationTriangle />
                                </div>
                                <div className="text-info h4 mb-1">
                                  {studentAttendanceStats.excused}
                                </div>
                                <div className="small text-muted">Excused</div>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="text-muted">Total Classes: {studentAttendanceStats.totalClasses}</span>
                            {studentAttendanceStats.attendancePercentage < 75 && (
                              <Alert variant="warning" className="py-1 px-2 mb-0 small">
                                <FaExclamationTriangle className="me-1" /> 
                                Your attendance is below 75%, which may affect your grades.
                              </Alert>
                            )}
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}

              {attendanceRecords.length === 0 ? (
                <div className="empty-state p-5 text-center bg-light rounded">
                  <FaCalendarCheck className="empty-state-icon mb-3" />
                  <h5>No Attendance Records</h5>
                  <p className="text-muted">
                    No attendance has been recorded for this course yet.
                  </p>
                </div>
              ) : (
                <Card>
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">
                      <FaCalendarAlt className="me-2" /> Attendance History
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table hover className="mb-0 attendance-list">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceRecords.map(record => {
                            // Find student's record for this date
                            const studentRecord = record.records.find(
                              r => r.studentId === user._id
                            );
                            
                            return (
                              <tr 
                                key={record._id} 
                                className={studentRecord ? getStatusClass(studentRecord.status) : ''}
                              >
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>
                                  {studentRecord ? 
                                    getStatusBadge(studentRecord.status) : 
                                    getStatusBadge('absent')}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StudentAttendance;