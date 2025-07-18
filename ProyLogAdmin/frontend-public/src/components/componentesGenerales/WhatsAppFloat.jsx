import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import '../../stayles/estiloFoot.css';

const WhatsAppFloat = () => {
  return (
    <div className="whatsapp-float">
      <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faComment} style={{ color: 'white' }} />
      </a>
    </div>
  );
};

export default WhatsAppFloat;