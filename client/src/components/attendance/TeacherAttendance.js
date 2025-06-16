import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Form, Table, Alert, Spinner, 
         Row, Col, Badge, Modal, Tabs, Tab } from 'react-bootstrap';
import { 
  FaCalendarCheck, 
  FaCalendarDay, 
  FaUserCheck, 
  FaUserTimes, 
  FaUserClock,
  FaChartBar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaList
} from 'react-icons/fa';
import CourseContext from '../../context/CourseContext';
import AttendanceContext from '../../context/AttendanceContext';

// CSS
import './Attendance.css';

const TeacherAttendance = () => {
  const { courses, getCourses } = useContext(CourseContext);
  const { 
    loading, 
    error, 
    markAttendance, 
    getAttendanceByCourse,
    getAttendanceByDate,
    getCourseAttendanceSummary,
    attendanceRecords,
    singleDayAttendance,
    courseAttendanceSummary
  } = useContext(AttendanceContext);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [attendanceData, setAttendanceData] = useState([]);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewDate, setViewDate] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [activeTab, setActiveTab] = useState('mark');
  const [summaryLoaded, setSummaryLoaded] = useState(false);

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
      loadAttendanceRecords();
      if (activeTab === 'summary') {
        loadAttendanceSummary();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse, activeTab]);

  useEffect(() => {
    if (showMarkModal && selectedCourse) {
      prepareAttendanceData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMarkModal, selectedCourse]);

  const prepareAttendanceData = async () => {
    // Find the selected course
    const course = courses.find(c => c._id === selectedCourse);
    
    if (!course || !course.students) return;
    
    // Check if attendance already exists for this date
    try {
      const existingAttendance = await getAttendanceByDate(selectedCourse, selectedDate);
      
      if (existingAttendance) {
        // Use existing records
        setAttendanceData(existingAttendance.records);
        setAlertMessage({
          type: 'info',
          message: `Attendance for ${new Date(selectedDate).toLocaleDateString()} already marked. You can update it.`
        });
      } else {
        // Create new attendance records for all students in the course
        const newAttendanceData = course.students.map(student => ({
          studentId: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
          status: 'absent' // Default status
        }));
        
        setAttendanceData(newAttendanceData);
        setAlertMessage({ type: '', message: '' });
      }
    } catch (error) {
      console.error('Error preparing attendance data:', error);
      // Initialize with students from course
      const newAttendanceData = course.students.map(student => ({
        studentId: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        status: 'absent' // Default status
      }));
      
      setAttendanceData(newAttendanceData);
    }
  };

  const loadAttendanceRecords = async () => {
    if (selectedCourse) {
      await getAttendanceByCourse(selectedCourse);
    }
  };

  const loadAttendanceSummary = async () => {
    if (selectedCourse) {
      await getCourseAttendanceSummary(selectedCourse);
      setSummaryLoaded(true);
    }
  };

  const handleSelectCourse = (e) => {
    setSelectedCourse(e.target.value);
    setSummaryLoaded(false);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prevData => 
      prevData.map(record => 
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const setAllStatus = (status) => {
    setAttendanceData(prevData => 
      prevData.map(record => ({ ...record, status }))
    );
  };

  const handleSubmitAttendance = async () => {
    try {
      const result = await markAttendance({
        courseId: selectedCourse,
        date: selectedDate,
        records: attendanceData
      });
      
      if (result.success) {
        setShowMarkModal(false);
        loadAttendanceRecords(); // Reload attendance records
        setAlertMessage({
          type: 'success',
          message: 'Attendance marked successfully'
        });
        setSummaryLoaded(false); // Reset summary so it reloads
        setTimeout(() => setAlertMessage({ type: '', message: '' }), 3000);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Failed to mark attendance'
        });
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setAlertMessage({
        type: 'danger',
        message: 'An unexpected error occurred'
      });
    }
  };

  const handleViewAttendance = async (date) => {
    try {
      await getAttendanceByDate(selectedCourse, date);
      setViewDate(date);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error viewing attendance:', error);
      setAlertMessage({
        type: 'danger',
        message: 'Failed to load attendance details'
      });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'summary' && selectedCourse && !summaryLoaded) {
      loadAttendanceSummary();
    }
  };

  const handleCloseModals = () => {
    setShowMarkModal(false);
    setShowViewModal(false);
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

  // Calculate percentage for progress bars
  const calcPercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
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
          <FaCalendarCheck className="me-2" /> Attendance
        </h2>
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

          <Tabs 
            activeKey={activeTab}
            onSelect={handleTabChange}
            className="mb-4"
          >
            <Tab eventKey="mark" title="Mark Attendance">
              <div className="mark-attendance-section">
                <div className="d-grid gap-2 mb-4">
                  <Button variant="primary" onClick={() => setShowMarkModal(true)}>
                    <FaCalendarDay className="me-2" /> Mark Today's Attendance
                  </Button>
                </div>
                
                {loading ? (
                  <div className="text-center my-5">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : attendanceRecords.length === 0 ? (
                  <div className="empty-state p-5 text-center bg-light rounded">
                    <FaCalendarCheck className="empty-state-icon mb-3" />
                    <h5>No Attendance Records</h5>
                    <p className="text-muted">
                      No attendance has been marked for this course yet. Click the button above to mark attendance.
                    </p>
                  </div>
                ) : (
                  <Card>
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">
                        <FaList className="me-2" /> Attendance Records
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <div className="table-responsive">
                        <Table hover className="mb-0">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Present</th>
                              <th>Absent</th>
                              <th>Late</th>
                              <th>Excused</th>
                              <th className="text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceRecords.map(record => {
                              // Calculate stats
                              const presentCount = record.records.filter(r => r.status === 'present').length;
                              const absentCount = record.records.filter(r => r.status === 'absent').length;
                              const lateCount = record.records.filter(r => r.status === 'late').length;
                              const excusedCount = record.records.filter(r => r.status === 'excused').length;
                              const total = record.records.length;
                              
                              return (
                                <tr key={record._id}>
                                  <td>{new Date(record.date).toLocaleDateString()}</td>
                                  <td className="text-success">{presentCount} ({calcPercentage(presentCount, total)}%)</td>
                                  <td className="text-danger">{absentCount} ({calcPercentage(absentCount, total)}%)</td>
                                  <td className="text-warning">{lateCount} ({calcPercentage(lateCount, total)}%)</td>
                                  <td className="text-info">{excusedCount} ({calcPercentage(excusedCount, total)}%)</td>
                                  <td className="text-end">
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      onClick={() => handleViewAttendance(record.date)}
                                    >
                                      View / Edit
                                    </Button>
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
              </div>
            </Tab>
            
            <Tab eventKey="summary" title="Attendance Summary">
              <div className="attendance-summary-section">
                {loading ? (
                  <div className="text-center my-5">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : !courseAttendanceSummary ? (
                  <div className="empty-state p-5 text-center bg-light rounded">
                    <FaChartBar className="empty-state-icon mb-3" />
                    <h5>No Attendance Data</h5>
                    <p className="text-muted">
                      No attendance summary is available for this course yet.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="summary-stats mb-4">
                      <Row>
                        <Col md={4}>
                          <Card className="text-center mb-3 shadow-sm">
                            <Card.Body>
                              <h2 className="mb-0">{courseAttendanceSummary.totalClasses}</h2>
                              <p className="text-muted mb-0">Total Classes</p>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card className="text-center mb-3 shadow-sm">
                            <Card.Body>
                              <h2 className="mb-0">{courseAttendanceSummary.studentCount}</h2>
                              <p className="text-muted mb-0">Students</p>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card className="text-center mb-3 shadow-sm">
                            <Card.Body>
                              <h2 className="mb-0">
                                {courseAttendanceSummary.totalClasses > 0 ? 
                                  courseAttendanceSummary.summary.reduce((acc, student) => 
                                    acc + student.attendancePercentage, 0) / 
                                    courseAttendanceSummary.studentCount : 0}%
                              </h2>
                              <p className="text-muted mb-0">Average Attendance</p>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                    
                    <Card className="mb-4">
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">
                          <FaUserCheck className="me-2" /> Student Attendance Summary
                        </h5>
                      </Card.Header>
                      <Card.Body className="p-0">
                        <div className="table-responsive">
                          <Table hover className="mb-0">
                            <thead>
                              <tr>
                                <th>Roll Number</th>
                                <th>Name</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Late</th>
                                <th>Excused</th>
                                <th>Attendance %</th>
                              </tr>
                            </thead>
                            <tbody>
                              {courseAttendanceSummary.summary.map(student => (
                                <tr key={student.studentId}>
                                  <td>{student.rollNumber}</td>
                                  <td>{student.name}</td>
                                  <td className="text-success">{student.present}</td>
                                  <td className="text-danger">{student.absent}</td>
                                  <td className="text-warning">{student.late}</td>
                                  <td className="text-info">{student.excused}</td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                        <div 
                                          className={`progress-bar ${student.attendancePercentage < 75 ? 'bg-danger' : 'bg-success'}`}
                                          style={{ width: `${student.attendancePercentage}%` }}
                                          role="progressbar"
                                          aria-valuenow={student.attendancePercentage}
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        ></div>
                                      </div>
                                      <span>{student.attendancePercentage}%</span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Card.Body>
                    </Card>
                    
                    <Alert variant="info">
                      <FaExclamationTriangle className="me-2" /> 
                      Students with less than 75% attendance may need extra attention.
                    </Alert>
                  </>
                )}
              </div>
            </Tab>
          </Tabs>
        </>
      )}

      {/* Mark Attendance Modal */}
      <Modal show={showMarkModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCalendarCheck className="me-2" /> Mark Attendance
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Control
                type="text"
                value={getCurrentCourseName()}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </Form.Group>

            <div className="mb-3 text-end">
              <Button 
                variant="outline-success" 
                size="sm" 
                className="me-2"
                onClick={() => setAllStatus('present')}
              >
                <FaUserCheck className="me-1" /> Mark All Present
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => setAllStatus('absent')}
              >
                <FaUserTimes className="me-1" /> Mark All Absent
              </Button>
            </div>

            {attendanceData.length === 0 ? (
              <Alert variant="warning">
                No students enrolled in this course. Add students to the course before marking attendance.
              </Alert>
            ) : (
              <div className="table-responsive">
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Roll No.</th>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map(student => (
                      <tr key={student.studentId}>
                        <td>{student.rollNumber}</td>
                        <td>{student.name}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            <Button 
                              variant={student.status === 'present' ? 'success' : 'outline-success'} 
                              size="sm"
                              onClick={() => handleStatusChange(student.studentId, 'present')}
                            >
                              <FaCheckCircle className="me-1" /> Present
                            </Button>
                            <Button 
                              variant={student.status === 'absent' ? 'danger' : 'outline-danger'} 
                              size="sm"
                              onClick={() => handleStatusChange(student.studentId, 'absent')}
                            >
                              <FaTimesCircle className="me-1" /> Absent
                            </Button>
                            <Button 
                              variant={student.status === 'late' ? 'warning' : 'outline-warning'} 
                              size="sm"
                              onClick={() => handleStatusChange(student.studentId, 'late')}
                            >
                              <FaUserClock className="me-1" /> Late
                            </Button>
                            <Button 
                              variant={student.status === 'excused' ? 'info' : 'outline-info'} 
                              size="sm"
                              onClick={() => handleStatusChange(student.studentId, 'excused')}
                            >
                              <FaExclamationTriangle className="me-1" /> Excused
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitAttendance}
            disabled={attendanceData.length === 0}
          >
            Submit Attendance
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Attendance Modal */}
      <Modal show={showViewModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCalendarDay className="me-2" /> 
            Attendance for {viewDate && new Date(viewDate).toLocaleDateString()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {singleDayAttendance && (
            <div className="table-responsive">
              <div className="mb-3 d-flex justify-content-between">
                <div>
                  <strong>Course:</strong> {getCurrentCourseName()}
                </div>
                <div>
                  <strong>Total Students:</strong> {singleDayAttendance.records.length}
                </div>
              </div>
              
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Roll No.</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {singleDayAttendance.records.map(record => (
                    <tr key={record.studentId}>
                      <td>{record.rollNumber}</td>
                      <td>{record.name}</td>
                      <td>{getStatusBadge(record.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              <div className="mt-3 text-end">
                <small className="text-muted">
                  Last updated: {new Date(singleDayAttendance.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setSelectedDate(new Date(viewDate).toISOString().substring(0, 10));
              setShowViewModal(false);
              setShowMarkModal(true);
            }}
          >
            Edit Attendance
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeacherAttendance;