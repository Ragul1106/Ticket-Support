import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useTickets from '../hooks/useTickets';
import MainLayout from '../components/Layout/MainLayout';
import TicketThread from '../components/TicketThread';
import ReplyEditor from '../components/ReplyEditor';
import AttachFileModal from '../components/AttachFileModal';
import RoleGuard from '../components/RoleGuard';
import StatusDropdown from '../components/StatusDropdown.jsx';
import './TicketDetailPage.css';

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const { tickets, addReply, updateTicketStatus } = useTickets();
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);

  const ticket = tickets.find(t => t._id === ticketId);

  if (!ticket) return <MainLayout>Ticket not found</MainLayout>;

  const handleReplySubmit = async (content) => {
    await addReply(ticketId, { content });
    setShowReplyEditor(false);
  };

  return (
    <MainLayout>
      <div className="ticket-detail-page">
        <div className="ticket-header">
          <h1>Ticket #{ticket.id}: {ticket.subject}</h1>
          <StatusDropdown 
            currentStatus={ticket.status}
            ticketId={ticket._id}
            onStatusChange={updateTicketStatus}
          />
        </div>
        
        <div className="ticket-meta">
          <span>Status: {ticket.status}</span>
          <span>Priority: {ticket.priority}</span>
          <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
        </div>

        <TicketThread ticket={ticket} />
        
        <RoleGuard allowedRoles={['agent', 'admin']}>
          {!showReplyEditor ? (
            <button 
              className="reply-button"
              onClick={() => setShowReplyEditor(true)}
            >
              Reply to Ticket
            </button>
          ) : (
            <ReplyEditor
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyEditor(false)}
              onAttach={() => setShowAttachModal(true)}
            />
          )}
        </RoleGuard>

        {showAttachModal && (
          <AttachFileModal
            onClose={() => setShowAttachModal(false)}
            onUpload={(files) => console.log('Files to upload:', files)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default TicketDetailPage;