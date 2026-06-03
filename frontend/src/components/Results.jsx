import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Results = () => {
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/votes/results');
      if (response.data.success) {
        setResults(response.data.results);
        setTotalVotes(response.data.totalVotes);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch election results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    
    // Auto-refresh results every 10 seconds for real-time presentation feel!
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && results.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-grow-1" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading results...</span>
        </div>
      </div>
    );
  }

  // Find the maximum vote count to determine leader(s)
  const maxVotes = results.length > 0 ? Math.max(...results.map(r => r.voteCount)) : 0;

  return (
    <div className="container py-5 fade-in-element">
      
      {/* Header */}
      <div className="row mb-5 align-items-center">
        <div className="col-md-8 text-center text-md-start">
          <h1 className="font-bold text-dark mb-1">Live Election Results</h1>
          <p className="text-muted">Real-time ballot counters displaying current standing. Auto-refreshes every 10s.</p>
        </div>
        <div className="col-md-4 text-center text-md-end d-flex gap-2 justify-content-center justify-content-md-end">
          <button onClick={fetchResults} className="btn btn-outline-secondary py-2 px-3" style={{ borderRadius: '8px' }}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
          <Link to="/" className="btn btn-secondary py-2 px-3" style={{ borderRadius: '8px', backgroundColor: '#64748b', borderColor: '#64748b' }}>
            <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert" style={{ borderRadius: '12px' }}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-white" style={{ borderRadius: '16px' }}>
            <div className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-3" style={{ width: '50px', height: '50px' }}>
              <i className="bi bi-envelope-paper-fill fs-4"></i>
            </div>
            <h5 className="text-muted small font-semibold text-uppercase tracking-wider">Total Ballots Cast</h5>
            <h2 className="display-5 font-bold text-dark mb-0">{totalVotes}</h2>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-white" style={{ borderRadius: '16px' }}>
            <div className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle mb-3" style={{ width: '50px', height: '50px' }}>
              <i className="bi bi-people-fill fs-4"></i>
            </div>
            <h5 className="text-muted small font-semibold text-uppercase tracking-wider">Active Candidates</h5>
            <h2 className="display-5 font-bold text-dark mb-0">{results.length}</h2>
          </div>
        </div>

        <div className="col-md-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-white" style={{ borderRadius: '16px' }}>
            <div className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning rounded-circle mb-3" style={{ width: '50px', height: '50px' }}>
              <i className="bi bi-trophy-fill fs-4"></i>
            </div>
            <h5 className="text-muted small font-semibold text-uppercase tracking-wider">Current Status</h5>
            <h2 className="h3 font-bold text-dark mb-0 py-2">
              {totalVotes === 0 ? 'Awaiting Ballots' : 'Election In Progress'}
            </h2>
          </div>
        </div>
      </div>

      {/* Main Results Listing */}
      <div className="glass-card shadow-sm">
        <h3 className="font-bold text-dark mb-4">
          <i className="bi bi-bar-chart-line text-primary me-2"></i>
          Standing & Percentages
        </h3>

        {results.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox-fill display-4"></i>
            <p className="mt-3">No results to display. Add candidates and vote to see data.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {results.map((candidate, index) => {
              const isLeader = maxVotes > 0 && candidate.voteCount === maxVotes;
              const numericPercent = parseFloat(candidate.percentage);
              
              return (
                <div key={candidate._id} className="p-3 border rounded bg-white shadow-xs results-card" style={{ borderLeftColor: isLeader ? '#10b981' : '#3b82f6' }}>
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-2">
                    
                    {/* Candidate Identity */}
                    <div className="d-flex align-items-center gap-3">
                      <span className="fs-2">{candidate.partySymbol}</span>
                      <div>
                        <h5 className="font-bold text-dark mb-0 d-inline-flex align-items-center">
                          {candidate.name}
                          {isLeader && totalVotes > 0 && (
                            <span className="badge bg-success ms-2 font-semibold" style={{ fontSize: '0.75rem', borderRadius: '4px' }}>
                              🏆 Leading
                            </span>
                          )}
                        </h5>
                        <p className="text-muted small mb-0 text-uppercase font-semibold">{candidate.party}</p>
                      </div>
                    </div>

                    {/* Vote Info */}
                    <div className="text-md-end">
                      <span className="h4 font-bold text-dark">{candidate.voteCount}</span>
                      <span className="text-muted small"> {candidate.voteCount === 1 ? 'vote' : 'votes'}</span>
                      <span className="badge bg-primary ms-2 font-bold px-2.5 py-1.5 fs-6" style={{ background: 'var(--primary-gradient)' }}>
                        {candidate.percentage}
                      </span>
                    </div>

                  </div>

                  {/* Progress Bar representing percentage */}
                  <div className="progress mt-3" style={{ height: '12px', borderRadius: '50px' }}>
                    <div 
                      className={`progress-bar progress-bar-striped progress-bar-animated ${isLeader ? 'bg-success' : 'bg-primary'}`} 
                      role="progressbar" 
                      style={{ 
                        width: `${numericPercent > 0 ? numericPercent : 0}%`,
                        backgroundImage: isLeader ? 'var(--success-gradient)' : 'var(--primary-gradient)',
                        borderRadius: '50px'
                      }} 
                      aria-valuenow={numericPercent} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default Results;
