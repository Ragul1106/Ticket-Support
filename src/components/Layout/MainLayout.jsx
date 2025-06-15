import React from 'react';
import { NavLink } from 'react-router-dom';
import './styles/MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <header className="app-header">
        {/* Header content */}
      </header>
      <div className="main-content">
        <aside className="app-sidebar">
          <nav>
            <ul>
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/tickets"
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Tickets
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;