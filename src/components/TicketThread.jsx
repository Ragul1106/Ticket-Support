import React from 'react';
import './TicketThread.css';
import { format } from 'date-fns';

const TicketThread = ({ ticket }) => {
  return (
    <div className="ticket-thread">
      <div className="ticket-header">
        <h2>{ticket.subject}</h2>
        <div className="ticket-meta">
          <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
          <span>Created: {format(new Date(ticket.createdAt), 'PPpp')}</span>
        </div>
      </div>
      
      <div className="thread-messages">
        <div className="initial-message">
          <div className="message-header">
            <strong>{ticket.user.name}</strong>
            <span>{format(new Date(ticket.createdAt), 'PPpp')}</span>
          </div>
          <div className="message-content">{ticket.description}</div>
        </div>

        {ticket.replies.map((reply, index) => (
          <div key={index} className="reply-message">
            <div className="message-header">
              <strong>{reply.user.name}</strong>
              <span>{format(new Date(reply.createdAt), 'PPpp')}</span>
            </div>
            <div className="message-content" dangerouslySetInnerHTML={{ __html: reply.content }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketThread;