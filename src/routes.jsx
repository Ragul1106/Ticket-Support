import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import RoleGuard from './components/RoleGuard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Main dashboard route */}
      <Route 
        path="/" 
        element={
          <RoleGuard allowedRoles={['admin', 'agent']}>
            <DashboardPage />
          </RoleGuard>
        } 
      />
      {/* Optional: Redirect /dashboard to / */}
      <Route 
        path="/dashboard" 
        element={<Navigate to="/" replace />}
      />
      <Route 
        path="/tickets" 
        element={
          <RoleGuard allowedRoles={['admin', 'agent', 'customer']}>
            <TicketsPage />
          </RoleGuard>
        } 
      />
      <Route 
        path="/tickets/:ticketId" 
        element={
          <RoleGuard allowedRoles={['admin', 'agent', 'customer']}>
            <TicketDetailPage />
          </RoleGuard>
        } 
      />
      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;