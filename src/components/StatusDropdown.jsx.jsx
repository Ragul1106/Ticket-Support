import React, { useState } from 'react';
import './StatusDropdown.css';

const statusOptions = [
  { value: 'open', label: 'Open', color: '#ffeb3b', textColor: '#000' },
  { value: 'pending', label: 'Pending', color: '#ff9800', textColor: '#fff' },
  { value: 'resolved', label: 'Resolved', color: '#4caf50', textColor: '#fff' }
];

const StatusDropdown = ({ currentStatus, ticketId, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStatusObj = statusOptions.find(s => s.value === currentStatus);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    const success = await onStatusChange(ticketId, newStatus);
    setIsUpdating(false);
    
    if (success) setIsOpen(false);
  };

  return (
    <div className="status-dropdown">
      <button 
        className="status-toggle"
        style={{ 
          backgroundColor: currentStatusObj.color,
          color: currentStatusObj.textColor
        }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
      >
        {isUpdating ? 'Updating...' : currentStatusObj.label}
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {statusOptions.map(status => (
            <button
              key={status.value}
              className="dropdown-item"
              style={{ 
                backgroundColor: status.color,
                color: status.textColor
              }}
              onClick={() => handleStatusChange(status.value)}
              disabled={status.value === currentStatus || isUpdating}
            >
              {status.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;