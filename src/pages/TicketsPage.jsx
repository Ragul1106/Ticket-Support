import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import useTickets from '../hooks/useTickets';
import './TicketsPage.css';

const TicketsPage = () => {
  const { tickets, isLoading } = useTickets();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get filter from URL
  const statusFilter = searchParams.get('status');
  
  // Filter tickets based on URL parameter
  const filteredTickets = statusFilter
    ? tickets.filter(ticket => ticket.status === statusFilter)
    : tickets;

  // Status options for filter tabs
  const statuses = [
    { value: 'all', label: 'All Tickets' },
    { value: 'open', label: 'Open' },
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' }
  ];

  if (isLoading) return <div className="loading">Loading tickets...</div>;

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <h1>
          {statusFilter 
            ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Tickets`
            : 'All Tickets'}
          <span className="ticket-count">({filteredTickets.length})</span>
        </h1>
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="status-tabs">
        {statuses.map(status => (
          <button
            key={status.value}
            className={`tab ${(!statusFilter && status.value === 'all') || statusFilter === status.value ? 'active' : ''}`}
            onClick={() => 
              status.value === 'all' 
                ? navigate('/tickets') 
                : navigate(`/tickets?status=${status.value}`)
            }
          >
            {status.label}
            {status.value !== 'all' && (
              <span className="count-badge">
                {tickets.filter(t => t.status === status.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="ticket-list">
        {filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <div 
              key={ticket._id} 
              className="ticket-card"
              onClick={() => navigate(`/tickets/${ticket._id}`)}
            >
              <div className="ticket-main">
                <h3>{ticket.subject}</h3>
                <p className="description">
                  {ticket.description.substring(0, 100)}
                  {ticket.description.length > 100 && '...'}
                </p>
              </div>
              <div className="ticket-meta">
                <span className={`status ${ticket.status}`}>
                  {ticket.status}
                </span>
                <span className="date">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
                <span className="replies">
                  {ticket.replies?.length || 0} replies
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-tickets">
            No tickets found{statusFilter ? ` with status "${statusFilter}"` : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;