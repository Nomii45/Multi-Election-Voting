import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [voterId, setVoterId] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState('user'); // default is user (voter)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Frontend validations
    if (!name || !email || !password || !voterId || !age) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (Number(age) < 18) {
      setError('You must be at least 18 years old to register as a voter');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Call registration context handler
    // We send role too, allowing testing admin easily in the viva environment
    const res = await register(name, email, password, voterId, age, role);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-wrapper fade-in-element">
      <div className="container" style={{ maxWidth: '520px' }}>
        
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-3" style={{ width: '60px', height: '60px', background: 'var(--success-gradient)' }}>
            <i className="bi bi-person-plus-fill fs-3"></i>
          </div>
          <h2 className="font-bold text-dark mb-1">Create Account</h2>
          <p className="text-muted">Register your digital ID to participate in the election</p>
        </div>

        <div className="glass-card">
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert" style={{ borderRadius: '8px' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label text-secondary small font-semibold">FULL NAME</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="voterId" className="form-label text-secondary small font-semibold">VOTER / NATIONAL ID</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  id="voterId"
                  placeholder="ID-982741"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-8 mb-3">
                <label htmlFor="email" className="form-label text-secondary small font-semibold">EMAIL ADDRESS</label>
                <input
                  type="email"
                  className="form-control form-control-custom"
                  id="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="age" className="form-label text-secondary small font-semibold">AGE (18+)</label>
                <input
                  type="number"
                  className="form-control form-control-custom"
                  id="age"
                  placeholder="24"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-secondary small font-semibold">PASSWORD (MIN 6 CHARS)</label>
              <input
                type="password"
                className="form-control form-control-custom"
                id="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="form-label text-secondary small font-semibold">REGISTRATION TYPE</label>
              <select
                id="role"
                className="form-select form-control-custom"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Voter (Standard User)</option>
                <option value="admin">System Administrator (Admin)</option>
              </select>
              <div className="form-text text-muted small">
                *Admin option added for easy testing and evaluation during your project presentation.
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-3 d-flex align-items-center justify-content-center"
              disabled={loading}
              style={{ background: 'var(--success-gradient)', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill me-2"></i> Submit Registration
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-3">
          <p className="text-muted small">
            Already registered? <Link to="/login" className="text-primary font-semibold text-decoration-none">Log In here</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
