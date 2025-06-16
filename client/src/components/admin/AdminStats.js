import React, { useEffect, useContext } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaUsers, 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaUserShield, 
  FaBriefcase, 
  FaCheckCircle, 
  FaTimesCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaThumbsUp
} from 'react-icons/fa';
import AdminContext from '../../context/AdminContext';

const StatCard = ({ title, value, icon, iconBg, description }) => (
  <Card className="mb-4">
    <Card.Body className="d-flex align-items-center">
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center me-3"
        style={{ 
          width: '60px', 
          height: '60px', 
          backgroundColor: iconBg,
        }}
      >
        {icon}
      </div>
      <div>
        <h3 className="fw-bold mb-0">{value}</h3>
        <div className="text-muted">{title}</div>
        {description && <small className="text-muted">{description}</small>}
      </div>
    </Card.Body>
  </Card>
);

const AdminStats = ({ showCards = true }) => {
  const { stats, loading, getStats } = useContext(AdminContext);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await getStats();
        console.log('Admin stats loaded:', result);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  // Ensure stats object exists
  const safeStats = stats || {
    users: { total: 0, students: 0, teachers: 0, admins: 0 },
    placements: { total: 0, active: 0, inactive: 0 },
    applications: { total: 0, pending: 0, selected: 0 }
  };

  return (
    <>
      {showCards && (
        <Row className="g-4">
          <Col md={6} lg={3}>
            <StatCard 
              title="Total Users" 
              value={safeStats.users.total} 
              icon={<FaUsers size={24} color="#fff" />}
              iconBg="#007bff"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard 
              title="Total Placements" 
              value={safeStats.placements.total} 
              icon={<FaBriefcase size={24} color="#fff" />}
              iconBg="#28a745"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard 
              title="Applications" 
              value={safeStats.applications.total} 
              icon={<FaFileAlt size={24} color="#fff" />}
              iconBg="#17a2b8"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard 
              title="Selected Students" 
              value={safeStats.applications.selected} 
              icon={<FaThumbsUp size={24} color="#fff" />}
              iconBg="#6f42c1"
            />
          </Col>
        </Row>
      )}

      <Row>
        {/* Users Statistics */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <FaUsers className="me-2" /> User Statistics
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <div className="flex-shrink-0">
                  <FaUserGraduate size={36} className="text-primary me-3" />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="mb-1">Students</h5>
                  <h3 className="mb-0">{safeStats.users.students}</h3>
                  <div className="progress mt-2" style={{ height: '5px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      role="progressbar" 
                      style={{ width: `${safeStats.users.total > 0 ? (safeStats.users.students / safeStats.users.total) * 100 : 0}%` }}
                      aria-valuenow={safeStats.users.total > 0 ? (safeStats.users.students / safeStats.users.total) * 100 : 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="flex-shrink-0">
                  <FaChalkboardTeacher size={36} className="text-success me-3" />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="mb-1">Teachers</h5>
                  <h3 className="mb-0">{safeStats.users.teachers}</h3>
                  <div className="progress mt-2" style={{ height: '5px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${safeStats.users.total > 0 ? (safeStats.users.teachers / safeStats.users.total) * 100 : 0}%` }}
                      aria-valuenow={safeStats.users.total > 0 ? (safeStats.users.teachers / safeStats.users.total) * 100 : 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <FaUserShield size={36} className="text-danger me-3" />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="mb-1">Admins</h5>
                  <h3 className="mb-0">{safeStats.users.admins}</h3>
                  <div className="progress mt-2" style={{ height: '5px' }}>
                    <div 
                      className="progress-bar bg-danger" 
                      role="progressbar" 
                      style={{ width: `${safeStats.users.total > 0 ? (safeStats.users.admins / safeStats.users.total) * 100 : 0}%` }}
                      aria-valuenow={safeStats.users.total > 0 ? (safeStats.users.admins / safeStats.users.total) * 100 : 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Placement Statistics */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <FaBriefcase className="me-2" /> Placement Statistics
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success bg-opacity-15 p-3 me-3">
                      <FaCheckCircle className="text-success" size={24} />
                    </div>
                    <div>
                      <div className="text-muted">Active Placements</div>
                      <h4 className="mb-0">{safeStats.placements.active}</h4>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-secondary bg-opacity-15 p-3 me-3">
                      <FaTimesCircle className="text-secondary" size={24} />
                    </div>
                    <div>
                      <div className="text-muted">Inactive Placements</div>
                      <h4 className="mb-0">{safeStats.placements.inactive}</h4>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="progress mb-3" style={{ height: '10px' }}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${safeStats.placements.total > 0 ? (safeStats.placements.active / safeStats.placements.total) * 100 : 0}%` }}
                  aria-valuenow={safeStats.placements.total > 0 ? (safeStats.placements.active / safeStats.placements.total) * 100 : 0}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  Active
                </div>
                <div 
                  className="progress-bar bg-secondary" 
                  role="progressbar" 
                  style={{ width: `${safeStats.placements.total > 0 ? (safeStats.placements.inactive / safeStats.placements.total) * 100 : 0}%` }}
                  aria-valuenow={safeStats.placements.total > 0 ? (safeStats.placements.inactive / safeStats.placements.total) * 100 : 0}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  Inactive
                </div>
              </div>

              <h5 className="mt-4 mb-3">Application Status</h5>

              <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 me-3">
                  <FaHourglassHalf size={24} className="text-warning" />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Pending Applications</span>
                    <span className="text-muted">
                      {safeStats.applications.pending} / {safeStats.applications.total}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '5px' }}>
                    <div 
                      className="progress-bar bg-warning" 
                      role="progressbar" 
                      style={{ width: `${safeStats.applications.total > 0 ? (safeStats.applications.pending / safeStats.applications.total) * 100 : 0}%` }}
                      aria-valuenow={safeStats.applications.total > 0 ? (safeStats.applications.pending / safeStats.applications.total) * 100 : 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <FaCheckCircle size={24} className="text-success" />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Selected Applications</span>
                    <span className="text-muted">
                      {safeStats.applications.selected} / {safeStats.applications.total}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '5px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${safeStats.applications.total > 0 ? (safeStats.applications.selected / safeStats.applications.total) * 100 : 0}%` }}
                      aria-valuenow={safeStats.applications.total > 0 ? (safeStats.applications.selected / safeStats.applications.total) * 100 : 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminStats;