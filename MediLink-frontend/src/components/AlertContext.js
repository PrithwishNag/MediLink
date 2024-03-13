import React, { createContext, useContext, useState } from 'react';
import { Toast } from 'react-bootstrap';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide the toast after 3 seconds
  };

  return (
    <AlertContext.Provider value={{ showToastMessage }}>
      {children}
      <Toast
        bg={toastType === 'success' ? "success" : "danger"}
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          minWidth: '200px',
          maxWidth: '300px',
          color: '#fff',
          height: 'auto',
        }}
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">{toastType === 'success' ? 'Success' : 'Error'}</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
