import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [partySymbol, setPartySymbol] = useState('🏏');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch candidates list to display in list
  const fetchCandidates = async () => {
    try {
      const response = await axios.get('/api/candidates');
      if (response.data.success) {
        setCandidates(response.data.candidates);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Handle adding a candidate
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setActionLoading(true);

    if (!name || !party) {
      setError('Please enter both name and party');
      setActionLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/candidates', {
        name,
        party,
        partySymbol
      });

      if (response.data.success) {
        setSuccess(`Candidate "${name}" added successfully!`);
        setName('');
        setParty('');
        setPartySymbol('🏏');
        // Refresh list
        fetchCandidates();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle deleting a candidate
  const handleDeleteCandidate = async (id, candidateName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete candidate "${candidateName}"?`);
    if (!confirmDelete) return;

    try {
      setError('');
      setSuccess('');
      const response = await axios.delete(`/api/candidates/${id}`);
      if (response.data.success) {
        setSuccess('Candidate deleted successfully!');
        fetchCandidates();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete candidate.');
    }
  };

  //lists of symbols/emojis for party 
  const symbols = ['🦁', '🦅', '🏹', '⚖️', '➙', '🏏', ];

  return (
    <div className="container py-5 fade-in-element">
      
      {/* Header */}
      <div className="row mb-5">
        <div className="col-12 text-center text-md-start d-md-flex align-items-center justify-content-between">
          <div>
            <h1 className="font-bold text-dark mb-1">Election Controller Portal</h1>
            <p className="text-muted">Register candidates, manage ballots, and monitor results.</p>
          </div>
          <div className="mt-3 mt-md-0">
            <Link to="/results" className="btn btn-primary-custom d-inline-flex align-items-center py-2.5 px-4" style={{ background: 'var(--admin-gradient)', boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)' }}>
              <i className="bi bi-bar-chart-fill me-2"></i> View Live Results
            </Link>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ borderRadius: '12px' }}>
          <i className="bi bi-exclamation-octagon-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert" style={{ borderRadius: '12px', borderLeft: '5px solid #198754' }}>
          <i className="bi bi-check-circle-fill me-2 text-success"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')} aria-label="Close"></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column - Add Candidate */}
        <div className="col-lg-5">
          <div className="glass-card shadow-sm h-100">
            <h3 className="font-bold text-dark mb-4">
              <i className="bi bi-person-fill-add text-primary me-2"></i>
              Add New Candidate
            </h3>
            
{/* CANDIDATE NAME */}
            <form onSubmit={handleAddCandidate}>
              <div className="mb-3">
                <label htmlFor="cName" className="form-label text-secondary small font-semibold">CANDIDATE FULL NAME</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  id="cName"
                  placeholder="e.g. Imran Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

{/* PARTY NAME */}
              <div className="mb-3">
                <label htmlFor="cParty" className="form-label text-secondary small font-semibold">PARTY NAME</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  id="cParty"
                  placeholder="e.g. PTI"
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  required
                />
              </div>

{/* PART LOGO */}
              <div className="mb-4">
                <label className="form-label text-secondary small font-semibold">PARTY SYMBOL / LOGO EMOJI</label>
                <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded border">
                  {symbols.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      className={`btn btn-sm ${partySymbol === sym ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
                      style={{ fontSize: '1.25rem', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => setPartySymbol(sym)}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-3"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering Candidate...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle-fill me-2"></i> Register Candidate
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Candidate List Management */}
        <div className="col-lg-7">
          <div className="glass-card shadow-sm h-100">
            <h3 className="font-bold text-dark mb-4">
              <i className="bi bi-people-fill text-primary me-2"></i>
              Manage Registered Candidates
            </h3>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading Candidates...</span>
                </div>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-card-list display-4"></i>
                <p className="mt-3">No candidates registered in this session.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{ width: '60px' }}>Logo</th>
                      <th scope="col">Candidate Name</th>
                      <th scope="col">Party Name</th>
                      <th scope="col" className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c) => (
                      <tr key={c._id}>
                        <td>
                          <span className="fs-3">{c.partySymbol}</span>
                        </td>
                        <td>
                          <strong className="text-dark">{c.name}</strong>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary-emphasis text-uppercase font-semibold px-2.5 py-1.5" style={{ letterSpacing: '0.5px' }}>
                            {c.party}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            onClick={() => handleDeleteCandidate(c._id, c.name)}
                            className="btn btn-outline-danger btn-sm p-2"
                            style={{ borderRadius: '8px' }}
                            title="Delete Candidate"
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
