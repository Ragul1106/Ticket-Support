import { useState, useEffect } from 'react';
import { mockTickets } from '../data/mockTickets';

const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock API functions
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setTickets(mockTickets);
    } catch (err) {
      setError("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      // In real app: await ticketAPI.updateStatus(ticketId, newStatus);
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket._id === ticketId
            ? { ...ticket, status: newStatus }
            : ticket
        )
      );
      return true;
    } catch (error) {
      console.error('Status update failed:', error);
      return false;
    }
  };

  const addReply = async (ticketId, replyData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket._id === ticketId
          ? {
              ...ticket,
              replies: [
                ...ticket.replies,
                {
                  content: replyData.content,
                  user: { name: "You", role: "agent" },
                  createdAt: new Date().toISOString()
                }
              ]
            }
          : ticket
      )
    );
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    isLoading,
    error,
    fetchTickets,
    updateTicketStatus,
    addReply
  };
};

export default useTickets;