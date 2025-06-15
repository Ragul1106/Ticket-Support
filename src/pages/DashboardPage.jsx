import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useTickets from '../hooks/useTickets';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const { tickets, isLoading } = useTickets();
  const navigate = useNavigate();

  // Calculate stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (isLoading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      <h1>Welcome back, {user?.name || user?.email}</h1>
      
      <div className="stats-grid">
        {/* Make each stat card clickable */}
        <div 
          className="stat-card total" 
          onClick={() => navigate('/tickets')}
        >
          <h3>Total Tickets</h3>
          <p>{stats.total}</p>
          <div className="view-all">View All →</div>
        </div>
        
        <div 
          className="stat-card open"
          onClick={() => navigate('/tickets?status=open')}
        >
          <h3>Open</h3>
          <p>{stats.open}</p>
        </div>
        
        <div 
          className="stat-card pending"
          onClick={() => navigate('/tickets?status=pending')}
        >
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>
        
        <div 
          className="stat-card resolved"
          onClick={() => navigate('/tickets?status=resolved')}
        >
          <h3>Resolved</h3>
          <p>{stats.resolved}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;