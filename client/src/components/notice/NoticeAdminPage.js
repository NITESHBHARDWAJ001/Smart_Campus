import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Table, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { onMessage,getMessaging,getToken } from 'firebase/messaging';

const NoticeAdminPage = () => {
  const [notices, setNotices] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', eventDate: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const messaging = getMessaging();
  const vapidKey = "BNwADXbIoWMCY_C70EW4Y3G9pHKp9M5wGkm98HEPZdGjTWK1lvAFwvWkImnKvJ5gXUr_xkyAxHlc7xtNwH6Zj_0";

  const fetchNotices = () => {
    axios.get('/api/notice')
  .then(res => {
    console.log('Fetched notices:', res);
    setNotices(res.data);
  })
  .catch(err => {
    console.error(err);
    setError('Failed to load notices.');
  });
  }

  useEffect(() => {
    fetchNotices();
    getToken(messaging, { vapidKey })
    onMessage(messaging, (payload) => {
              console.log('Message received. ', payload);
              // Customize notification here
              const notificationTitle = payload.notification.title;
              const notificationOptions = {
                body: payload.notification.body,
              };
      
              new Notification(notificationTitle, notificationOptions);
            }
            );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      if (editingId) {
        await axios.put(`/api/notice/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Notice updated successfully');
        await axios.post('/api/admin/demo',{
          token:"eMCXp-kBbsFI8R7IL-9OY9:APA91bGjVTT_JbRVlhK3KaLPg_5SKBjV1fUbJZ7Z7cUzCE-BnCZNUbO4een2Y6jnkBCIolYJqIyWcUvhcmkIVZw1jOXVDhBa20SXbTJurGM7VLTbC451orQ",
          title:"A notice have been edited",
          description: `${formData.description}`,
        })
      } else {
        await axios.post('/api/notice', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Notice created successfully');
        await axios.post('/api/admin/demo',{
          token:"eMCXp-kBbsFI8R7IL-9OY9:APA91bGjVTT_JbRVlhK3KaLPg_5SKBjV1fUbJZ7Z7cUzCE-BnCZNUbO4een2Y6jnkBCIolYJqIyWcUvhcmkIVZw1jOXVDhBa20SXbTJurGM7VLTbC451orQ",
          title:"A new notice have been created",
          description: `${formData.description}`,
        })
      }
      resetForm();
      fetchNotices();
    } catch (err) {
      console.error(err);
      setError('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await axios.delete(`/api/notice/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Notice deleted successfully');
        fetchNotices();
      } catch (err) {
        console.error(err);
        setError('Delete failed');
      }
    }
  };

  const handleEdit = async(notice) => {
    setFormData({
      title: notice.title,
      description: notice.description,
      eventDate: notice.eventDate?.split('T')[0] || '',
    });
    setEditingId(notice._id);
    setShowModal(true);
  
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', eventDate: '' });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="main-content" style={{ marginLeft: '250px', padding: '30px 40px' }}>
      <h2 className="fw-bold mb-4">Admin: Manage Notices & Events</h2>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-end mb-3">
        <Button onClick={() => { setShowModal(true); setEditingId(null); }} variant="primary">
          <FaPlus className="me-2" /> Create New Notice
        </Button>
      </div>

      <Table striped bordered responsive hover>
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Event Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notices.map(notice => (
            <tr key={notice._id}>
              <td>{notice.title}</td>
              <td>{notice.description}</td>
              <td>{notice.eventDate ? new Date(notice.eventDate).toLocaleDateString() : '-'}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(notice)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(notice._id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Create/Edit */}
      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Notice' : 'Create Notice'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                required
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                required
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.eventDate}
                onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">
              {editingId ? 'Update Notice' : 'Create Notice'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NoticeAdminPage;
