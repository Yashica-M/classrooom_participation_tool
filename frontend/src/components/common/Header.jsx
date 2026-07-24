import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">Classroom Participation Tool</Link>
        </div>
        <nav className="nav-links">
          {user ? (
            <>
              <span className="welcome-message">Welcome, {user.name}</span>
              <Link to="/">Dashboard</Link>
              <button onClick={logout} className="logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;