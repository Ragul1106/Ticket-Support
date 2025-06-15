import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusDropdown from './StatusDropdown.jsx';
import './TicketCard.css';

const TicketCard = ({ ticket, onStatusChange }) => {
  const navigate = useNavigate();
  const replyCount = ticket.replies?.length || 0;

  return (
    <div 
      className="ticket-card"
      onClick={() => navigate(`/tickets/${ticket._id}`)}
    >
      <div className="ticket-main">
        <h3>{ticket.subject}</h3>
        <p className="description">{ticket.description.substring(0, 100)}...</p>
      </div>
      
      <div className="ticket-footer">
        <StatusDropdown
          currentStatus={ticket.status}
          ticketId={ticket._id}
          onStatusChange={onStatusChange}
        />
        
        <div className="ticket-meta">
          <span className="date">
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
          <span className={`replies ${replyCount > 0 ? 'has-replies' : ''}`}>
            {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;