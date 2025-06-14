import React, { useState, useEffect, useContext, createContext } from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from 'react-dom/client'

// Mock API to simulate fetching and sending data
const mockTicketsData = [
  {
    id: 'TKT001',
    subject: 'Issue with login functionality on mobile',
    status: 'Open',
    priority: 'High',
    customer: 'Alice Wonderland',
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-26T10:30:00Z',
    thread: [
      { sender: 'Alice Wonderland', role: 'customer', message: 'I cannot log in from my mobile device. It just shows a spinning wheel.', timestamp: '2023-10-26T10:00:00Z' },
      { sender: 'Agent John', role: 'agent', message: 'Thank you for reporting. Could you please provide your device model and browser version?', timestamp: '2023-10-26T10:15:00Z' },
      { sender: 'Alice Wonderland', role: 'customer', message: 'It\'s an iPhone 13 Pro, Safari browser, iOS 17.0.2', timestamp: '2023-10-26T10:30:00Z' },
    ],
  },
  {
    id: 'TKT002',
    subject: 'Request for new feature: Dark Mode',
    status: 'New',
    priority: 'Low',
    customer: 'Bob The Builder',
    createdAt: '2023-10-25T14:00:00Z',
    updatedAt: '2023-10-25T14:00:00Z',
    thread: [
      { sender: 'Bob The Builder', role: 'customer', message: 'Hi, I\'d love to see a dark mode option in your application. My eyes would appreciate it!', timestamp: '2023-10-25T14:00:00Z' },
    ],
  },
  {
    id: 'TKT003',
    subject: 'Payment processing error on recent transaction',
    status: 'Closed',
    priority: 'High',
    customer: 'Charlie Chaplin',
    createdAt: '2023-10-24T09:00:00Z',
    updatedAt: '2023-10-24T11:00:00Z',
    thread: [
      { sender: 'Charlie Chaplin', role: 'customer', message: 'My last payment failed, but my bank says the transaction went through. Please investigate.', timestamp: '2023-10-24T09:00:00Z' },
      { sender: 'Agent Sarah', role: 'agent', message: 'We are looking into this for you. Could you provide the transaction ID?', timestamp: '2023-10-24T09:30:00Z' },
      { sender: 'Charlie Chaplin', role: 'customer', message: 'Transaction ID: XYZ789', timestamp: '2023-10-24T09:45:00Z' },
      { sender: 'Agent Sarah', role: 'agent', message: 'Thank you for the ID. We\'ve identified the issue and the payment has been reconciled. You should see it reflected shortly.', timestamp: '2023-10-24T10:30:00Z' },
      { sender: 'Charlie Chaplin', role: 'customer', message: 'Got it, thank you!', timestamp: '2023-10-24T11:00:00Z' },
    ],
  },
];

// Simulate API calls with a delay
const api = {
  fetchTickets: async () => {
    return new Promise(resolve => setTimeout(() => resolve(mockTicketsData), 500));
  },
  fetchTicketById: async (ticketId) => {
    return new Promise(resolve => setTimeout(() => {
      const ticket = mockTicketsData.find(t => t.id === ticketId);
      resolve(ticket ? { ...ticket } : null); // Return a copy to avoid direct mutation
    }, 500));
  },
  sendReply: async (ticketId, message, senderRole, senderName) => {
    return new Promise(resolve => setTimeout(() => {
      const ticket = mockTicketsData.find(t => t.id === ticketId);
      if (ticket) {
        const newReply = {
          sender: senderName,
          role: senderRole,
          message: message,
          timestamp: new Date().toISOString(),
        };
        ticket.thread.push(newReply);
        ticket.updatedAt = newReply.timestamp;
        ticket.status = 'Open'; // Automatically reopen if a reply is sent
        resolve(newReply);
      } else {
        resolve(null);
      }
    }, 300));
  },
};

// --- Context for User Role and Navigation ---
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('customer'); // Default role
  const [currentRoute, setCurrentRoute] = useState('/tickets');
  const [currentTicketId, setCurrentTicketId] = useState(null);
  const [showRoleSelect, setShowRoleSelect] = useState(false); // State to control visibility of role selection

  const navigate = (path) => {
    if (path.startsWith('/tickets/')) {
      setCurrentRoute('/tickets/:ticketId');
      setCurrentTicketId(path.split('/')[2]);
    } else {
      setCurrentRoute(path);
      setCurrentTicketId(null);
    }
  };

  const currentUser = {
    role: userRole,
    name: userRole === 'admin' ? 'Admin User' : (userRole === 'agent' ? 'Agent Lisa' : 'Customer Alex'),
  };

  return (
    <AppContext.Provider value={{ userRole, setUserRole, currentRoute, navigate, currentTicketId, currentUser, showRoleSelect, setShowRoleSelect }}>
      {children}
    </AppContext.Provider>
  );
};

// --- Higher-Order Component for Access Control ---
const withRoleGuard = (Component, allowedRoles) => {
  return (props) => {
    const { userRole } = useContext(AppContext);
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!rolesArray.includes(userRole)) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="alert alert-danger shadow-lg" role="alert">
            <strong className="font-weight-bold">Access Denied!</strong>
            <span className="ms-2">You do not have permission to view this page.</span>
          </div>
        </div>
      );
    }
    return <Component {...props} />;
  };
};

// --- RichTextEditor as a Portal Component ---
// Now accepts 'currentUser' as a prop instead of consuming context directly
const RichTextEditorPortal = ({ onClose, onSendReply, ticketId, currentUser }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleSend = async () => {
    if (replyContent.trim()) {
      await onSendReply(ticketId, replyContent, currentUser.role, currentUser.name);
      setReplyContent('');
      onClose(); // Close the portal after sending
    }
  };

  // Ensure the portal root exists
  let portalRoot = document.getElementById('portal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'portal-root';
    document.body.appendChild(portalRoot);
  }

  return ReactDOM.createPortal(
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reply to Ticket {ticketId}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <textarea
              className="form-control"
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows="5"
            ></textarea>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSend}>
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

// --- Ticket List Component ---
const TicketList = () => {
  const { navigate, userRole, currentUser } = useContext(AppContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await api.fetchTickets();
        // Filter tickets for 'customer' role
        if (userRole === 'customer') {
          setTickets(data.filter(ticket => ticket.customer === currentUser.name));
        } else {
          setTickets(data);
        }
      } catch (err) {
        setError('Failed to fetch tickets.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [userRole, currentUser.name]);

  if (loading) return <div className="text-center text-muted mt-5">Loading tickets...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Your Tickets</h2>
      {tickets.length === 0 ? (
        <p className="text-center text-muted">No tickets found for your role.</p>
      ) : (
        <div className="card shadow-sm">
          <ul className="list-group list-group-flush">
            {tickets.map(ticket => (
              <li
                key={ticket.id}
                className="list-group-item list-group-item-action"
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <div className="d-flex w-100 justify-content-between">
                  <small className="text-primary">{ticket.id}</small>
                  <span className={`badge ${
                    ticket.status === 'Open' ? 'bg-success' :
                    ticket.status === 'Closed' ? 'bg-danger' :
                    'bg-warning text-dark'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <h5 className="mb-1">{ticket.subject}</h5>
                <p className="mb-1 text-muted">
                  Customer: {ticket.customer}
                </p>
                <small className="text-muted">
                  Last Updated: {new Date(ticket.updatedAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Role-guarded TicketList
const GuardedTicketList = withRoleGuard(TicketList, ['admin', 'agent', 'customer']);


// --- Ticket Detail Component ---
const TicketDetail = () => {
  const { currentTicketId, navigate, currentUser } = useContext(AppContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReplyEditor, setShowReplyEditor] = useState(false);

  const fetchTicket = async () => {
    if (!currentTicketId) {
      setError('No ticket ID provided.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await api.fetchTicketById(currentTicketId);
      if (!data) {
        setError('Ticket not found.');
      } else {
        // Additional access control check for customer
        if (currentUser.role === 'customer' && data.customer !== currentUser.name) {
          setError('You are not authorized to view this ticket.');
          setTicket(null);
        } else {
          setTicket(data);
        }
      }
    } catch (err) {
      setError('Failed to fetch ticket details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [currentTicketId, currentUser.name, currentUser.role]); // Re-fetch if ticketId or user changes

  const handleSendReply = async (id, message, senderRole, senderName) => {
    try {
      setLoading(true);
      await api.sendReply(id, message, senderRole, senderName);
      await fetchTicket(); // Re-fetch the updated ticket thread
    } catch (err) {
      setError('Failed to send reply.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-muted mt-5">Loading ticket details...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;
  if (!ticket) return <div className="text-center text-muted mt-5">Ticket not found or unauthorized.</div>;

  return (
    <div className="container mt-4">
      <button
        onClick={() => navigate('/tickets')}
        className="btn btn-light mb-3 d-flex align-items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left me-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back to Tickets
      </button>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="card-title mb-4">{ticket.subject}</h2>
          <div className="row g-3 mb-4 text-muted">
            <div className="col-md-6">
              <p className="mb-1"><strong>Ticket ID:</strong> {ticket.id}</p>
              <p className="mb-1"><strong>Customer:</strong> {ticket.customer}</p>
              <p className="mb-1"><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Status:</strong>{' '}
                <span className={`badge ${
                  ticket.status === 'Open' ? 'bg-success' :
                  ticket.status === 'Closed' ? 'bg-danger' :
                  'bg-warning text-dark'
                }`}>
                  {ticket.status}
                </span>
              </p>
              <p className="mb-1"><strong>Priority:</strong> {ticket.priority}</p>
              <p className="mb-1"><strong>Last Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Ticket Thread</h3>
          <div className="overflow-auto" style={{ maxHeight: '400px' }}>
            {ticket.thread.map((message, index) => (
              <div
                key={index}
                className={`card mb-3 ${
                  message.role === 'customer'
                    ? 'bg-light border-primary'
                    : 'bg-info bg-opacity-10 border-info'
                }`}
              >
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="card-subtitle text-muted text-capitalize">{message.sender} ({message.role})</strong>
                    <small className="text-muted">{new Date(message.timestamp).toLocaleString()}</small>
                  </div>
                  <p className="card-text">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button
          onClick={() => setShowReplyEditor(true)}
          className="btn btn-primary btn-lg"
        >
          Reply to Ticket
        </button>
      </div>

      {showReplyEditor && (
        <RichTextEditorPortal
          onClose={() => setShowReplyEditor(false)}
          onSendReply={handleSendReply}
          ticketId={ticket.id}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

// Role-guarded TicketDetail
const GuardedTicketDetail = withRoleGuard(TicketDetail, ['admin', 'agent', 'customer']);


// --- Main App Component ---
function App() {
  const { currentRoute, currentTicketId, userRole, setUserRole, showRoleSelect, setShowRoleSelect, currentUser } = useContext(AppContext);

  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
    setShowRoleSelect(false); // Hide role selector after selection
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header and Role Selector */}
      <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand text-primary fw-bold" href="#">Ticket Support</a>
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle"
              type="button"
              id="roleDropdown"
              data-bs-toggle="dropdown"
              aria-expanded={showRoleSelect}
              onClick={() => setShowRoleSelect(!showRoleSelect)}
            >
              Current Role: <span className="fw-semibold text-capitalize">{userRole}</span>
            </button>
            <ul className={`dropdown-menu dropdown-menu-end ${showRoleSelect ? 'show' : ''}`} aria-labelledby="roleDropdown">
              <li><button className="dropdown-item" onClick={() => handleRoleChange({ target: { value: 'customer' } })}>Customer</button></li>
              <li><button className="dropdown-item" onClick={() => handleRoleChange({ target: { value: 'agent' } })}>Agent</button></li>
              <li><button className="dropdown-item" onClick={() => handleRoleChange({ target: { value: 'admin' } })}>Admin</button></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="py-4">
        {/* Simple router logic */}
        {currentRoute === '/tickets' && <GuardedTicketList />}
        {currentRoute === '/tickets/:ticketId' && <GuardedTicketDetail />}
      </main>
    </div>
  );
}

// Export the App component as default
export default App;

// Add Bootstrap CSS and JS CDN links to the document head and render the app
const addStylesheetsAndRenderApp = () => {
  // Bootstrap CSS
  const bootstrapCssLink = document.createElement('link');
  bootstrapCssLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
  bootstrapCssLink.rel = 'stylesheet';
  bootstrapCssLink.integrity = 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH';
  bootstrapCssLink.crossOrigin = 'anonymous';
  document.head.appendChild(bootstrapCssLink);

  // Bootstrap JS (bundle with Popper)
  const bootstrapJsScript = document.createElement('script');
  bootstrapJsScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
  bootstrapJsScript.integrity = 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz';
  bootstrapJsScript.crossOrigin = 'anonymous';
  document.body.appendChild(bootstrapJsScript); // Append to body for proper loading

  // Inter Font (optional, but good practice for consistent font)
  const interFontLink = document.createElement('link');
  interFontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  interFontLink.rel = 'stylesheet';
  document.head.appendChild(interFontLink);

  // Custom styles for global font and rounded corners, if not covered by Bootstrap defaults
  const customStyle = document.createElement('style');
  customStyle.innerHTML = `
    body { font-family: 'Inter', sans-serif; }
    /* Bootstrap generally handles rounded corners, but adding a fallback/reinforcement */
    .card, .btn, .form-control, .list-group-item, .modal-content {
      border-radius: 0.5rem !important; /* Apply rounded corners more consistently */
    }
  `;
  document.head.appendChild(customStyle);

  // Ensure the root element exists and render the app
  let rootElement = document.getElementById('root');
  if (!rootElement) {
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
    rootElement = newRoot;
  }

  // Use createRoot for React 18+
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <AppProvider>
      <App />
    </AppProvider>
  );
};

// Call this function when the DOM is ready
document.addEventListener('DOMContentLoaded', addStylesheetsAndRenderApp);
