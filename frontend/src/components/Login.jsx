import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-wrapper fade-in-element">
      <div className="container" style={{ maxWidth: '480px' }}>
        
        {/* Brand visual header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3" style={{ width: '60px', height: '60px', background: 'var(--primary-gradient)' }}>
            <i className="bi bi-shield-lock-fill fs-3"></i>
          </div>
          <h2 className="font-bold text-dark mb-1">Welcome Back</h2>
          <p className="text-muted">Log in to cast your secure electronic vote</p>
        </div>

        {/* Card Form */}
        <div className="glass-card">
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert" style={{ borderRadius: '8px' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-secondary small font-semibold">EMAIL ADDRESS</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '8px 0 0 8px' }}>
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  className="form-control form-control-custom border-start-0 ps-0"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: '0 8px 8px 0' }}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label text-secondary small font-semibold">PASSWORD</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '8px 0 0 8px' }}>
                  <i className="bi bi-key text-muted"></i>
                </span>
                <input
                  type="password"
                  className="form-control form-control-custom border-start-0 ps-0"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: '0 8px 8px 0' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-3 d-flex align-items-center justify-content-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i> Secure Log In
                </>
              )}
            </button>
          </form>

          {/* Quick Admin/Voter Account helper notice (Great for Vivas and testing) */}
          <div className="mt-4 p-3 bg-light rounded text-center small text-muted border">
            <i className="bi bi-info-circle me-1 text-primary"></i> 
            Both <strong>Voters</strong> and <strong>Admins</strong> log in here.
          </div>
        </div>

        <div className="text-center mt-3">
          <p className="text-muted small">
            Don't have an account? <Link to="/register" className="text-primary font-semibold text-decoration-none">Register Here</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
