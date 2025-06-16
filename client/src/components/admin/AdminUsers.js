import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Badge, Row, Col, Card, Form, Pagination, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaTrash, FaEdit, FaEye, FaFilter, FaSearch, FaUserPlus } from 'react-icons/fa';
import AdminContext from '../../context/AdminContext';

const AdminUsers = () => {
  const { users, loading, error, pagination, getUsers, deleteUser } = useContext(AdminContext);
  
  // Debug logs
  console.log('AdminUsers component rendered', { users, loading, error, pagination });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, [currentPage, roleFilter]);

  const loadUsers = async () => {
    const filters = {};
    if (roleFilter) filters.role = roleFilter;
    if (searchTerm) filters.search = searchTerm;
    const result = await getUsers(currentPage, 10, filters);
    console.log('Loaded users:', result);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    loadUsers();
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      const result = await deleteUser(userToDelete._id);
      setShowDeleteModal(false);
      
      if (result.success) {
        setAlertVariant('success');
        setAlertMessage(`User ${userToDelete.name} deleted successfully.`);
      } else {
        setAlertVariant('danger');
        setAlertMessage(`Error: ${result.message || 'Could not delete user.'}`);
      }
      
      setShowAlert(true);
      // If we deleted the last user on the current page, go to previous page
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        loadUsers();
      }
    }
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

  const getUserRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge bg="danger">Admin</Badge>;
      case 'teacher':
        return <Badge bg="info">Teacher</Badge>;
      case 'student':
        return <Badge bg="success">Student</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
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
                    placeholder="Search users..."
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
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5} className="text-md-end">
              <Button variant="success">
                <FaUserPlus className="me-1" /> Add User
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
      ) : !users || users.length === 0 ? (
        <Alert variant="info">
          No users found. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <Card>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Registration Date</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{getUserRoleBadge(user.role)}</td>
                        <td>{user.department || '-'}</td>
                        <td>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="text-center">
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            className="me-2"
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
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
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination?.total || 0)} of {pagination?.total || 0} users
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
          Are you sure you want to delete the user "{userToDelete?.name}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers;