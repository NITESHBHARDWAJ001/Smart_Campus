import React from 'react';
import { Spinner as BootstrapSpinner, Container } from 'react-bootstrap';

const Spinner = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <BootstrapSpinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3">Loading...</p>
      </div>
    </Container>
  );
};

export default Spinner;