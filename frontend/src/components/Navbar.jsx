import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom d-flex align-items-center" to="/">
          <span className="me-2">🗳️</span>
          <span>E-VOTE SYSTEM</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            {isAuthenticated && !isAdmin && (
              <li className="nav-item">
                <Link className={`nav-link nav-link-custom ${isActive('/')}`} to="/">
                  <i className="bi bi-person-badge me-1"></i> Candidates
                </Link>
              </li>
            )}
            
            {isAuthenticated && isAdmin && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/')}`} to="/">
                    <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-custom ${isActive('/results')}`} to="/results">
                    <i className="bi bi-bar-chart-fill me-1"></i> Live Results
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <>
                <div className="me-3 text-end d-none d-md-block">
                  <span className="d-block text-muted small" style={{ fontSize: '0.75rem' }}>
                    Logged in as:
                  </span>
                  <span className="font-semibold text-dark">
                    {user?.name} {isAdmin ? '(Admin)' : `(Voter ID: ${user?.voterId})`}
                  </span>
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-danger btn-sm d-flex align-items-center py-2 px-3"
                  style={{ borderRadius: '8px' }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Link to="/login" className="btn btn-outline-primary me-2 py-2 px-4" style={{ borderRadius: '8px', border: '1px solid #3b82f6', color: '#3b82f6' }}>
                    Login
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link to="/register" className="btn btn-primary-custom py-2 px-4">
                    Register
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
