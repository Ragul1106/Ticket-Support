import React, { useEffect, useState } from 'react';
import './TicketList.css';
import TicketCard from './TicketCard';

const TicketList = ({ tickets, onSelectTicket }) => {
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter(ticket => ticket.status === statusFilter));
    }
  }, [tickets, statusFilter]);

  return (
    <div className="ticket-list">
      <div className="filter-controls">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Tickets</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      {filteredTickets.map(ticket => (
        <TicketCard 
          key={ticket._id} 
          ticket={ticket} 
          onClick={() => onSelectTicket(ticket._id)}
        />
      ))}
    </div>
  );
};

export default TicketList;