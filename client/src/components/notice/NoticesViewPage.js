import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'react-bootstrap';

const NoticesViewPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/notice')
      .then(res => {
        setNotices(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching notices:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="main-content" style={{ marginLeft: '250px', padding: '30px 40px' }}>
      <h2 className="fw-bold mb-4 text-center">Campus Notices & Events</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="row">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <div className="col-md-6 mb-4" key={notice._id}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-primary">{notice.title}</Card.Title>
                    <Card.Text>{notice.description}</Card.Text>
                    {notice.eventDate && (
                      <p><strong>Event Date:</strong> {new Date(notice.eventDate).toLocaleDateString()}</p>
                    )}
                    <p className="text-muted small">Posted on: {new Date(notice.createdAt).toLocaleDateString()}</p>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">No notices available.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NoticesViewPage;
