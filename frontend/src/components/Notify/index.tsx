import React, { useEffect, useState } from 'react';
import './notification.css';

const Notification = ({ message, duration, onClose, color }: any) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message, duration, onClose]);

  return (
    <div className={`notification-container`}>
      <div
        className={`notification${show ? ' show' : ''}`}
        style={{ backgroundColor: color }}
      >
        {message}
      </div>
    </div>
  );
};

export default Notification;
