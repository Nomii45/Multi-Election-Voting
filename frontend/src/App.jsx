import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CandidateList from './components/CandidateList';
import AdminDashboard from './components/AdminDashboard';
import Results from './components/Results';

// Protected Route wrapper for standard voters
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-grow-1" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Protected Route wrapper for admins only
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-grow-1" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated && isAdmin ? children : <Navigate to="/login" />;
};

// Main Routing Component mapping dashboards dynamically
const MainDashboard = () => {
  const { isAdmin } = useContext(AuthContext);
  return isAdmin ? <AdminDashboard /> : <CandidateList />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          
          <main className="flex-grow-1 d-flex flex-column bg-light">
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Private routes depending on role */}
              <Route path="/" element={
                <PrivateRoute>
                  <MainDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/results" element={
                <AdminRoute>
                  <Results />
                </AdminRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="bg-white border-top py-3 text-center text-muted">
            <div className="container">
              <p className="mb-0 small">
                &copy; {new Date().getFullYear()} E-Vote Online Voting System.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
