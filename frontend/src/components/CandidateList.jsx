import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [voteLoading, setVoteLoading] = useState(null); // stores candidateId being voted for
  
  const { user, updateUserData } = useContext(AuthContext);

  // Fetch candidates list on load
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/candidates');
      if (response.data.success) {
        setCandidates(response.data.candidates);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Handle casting a vote
  const handleVote = async (candidateId, candidateName) => {
    // Standard confirm box to verify choice
    const confirmVote = window.confirm(`Are you sure you want to cast your vote for "${candidateName}"? This action cannot be undone.`);
    if (!confirmVote) return;

    try {
      setVoteLoading(candidateId);
      setError('');
      setSuccess('');
      
      const response = await axios.post(`/api/votes/${candidateId}`);
      
      if (response.data.success) {
        setSuccess(`Your vote for "${candidateName}" has been successfully recorded!`);
        // Update user context (marks user as voted and saves votedCandidate reference)
        updateUserData(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote.');
    } finally {
      setVoteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-grow-1" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading candidates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 fade-in-element">
      <div className="row mb-4">
        <div className="col-12 text-center text-md-start d-md-flex align-items-center justify-content-between">
          <div>
            <h1 className="font-bold text-dark mb-1">Democratic Voting Panel</h1>
            <p className="text-muted">Review candidates below and exercise your right to vote.</p>
          </div>
          
          <div className="mt-3 mt-md-0">
            {user?.isVoted ? (
              <span className="badge bg-success voted-badge shadow-sm px-4 py-3 d-inline-flex align-items-center">
                <i className="bi bi-patch-check-fill me-2 fs-5"></i>
                VOTING COMPLETE (Status: Voted)
              </span>
            ) : (
              <span className="badge bg-warning text-dark voted-badge shadow-sm px-4 py-3 d-inline-flex align-items-center">
                <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                VOTE PENDING (1 Vote Remaining)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Alert Notices */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ borderRadius: '12px' }}>
          <i className="bi bi-exclamation-octagon-fill me-2"></i>
          <strong>Error: </strong> {error}
          <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert" style={{ borderRadius: '12px', borderLeft: '5px solid #198754' }}>
          <i className="bi bi-check-circle-fill me-2 text-success"></i>
          <strong>Success: </strong> {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')} aria-label="Close"></button>
        </div>
      )}

      {/* Instruction Box */}
      <div className="card border-0 shadow-sm mb-4 p-4" style={{ borderRadius: '12px', backgroundColor: '#e0f2fe' }}>
        <h5 className="font-bold text-primary mb-2"><i className="bi bi-shield-check me-2"></i>Secure Ballot Instructions</h5>
        <ul className="mb-0 text-secondary-emphasis" style={{ paddingLeft: '20px' }}>
          <li>Each registered voter is legally entitled to cast exactly <strong>one (1)</strong> vote.</li>
          <li>Your vote is cryptographically tied to your registered Voter ID in the backend database.</li>
          <li>Once cast, your vote is permanent and cannot be modified, deleted, or transferred.</li>
        </ul>
      </div>

      {/* Candidates Grid */}
      {candidates.length === 0 ? (
        <div className="text-center p-5 bg-white rounded shadow-sm border mt-4">
          <i className="bi bi-people text-muted display-1"></i>
          <h4 className="mt-3 text-secondary">No Candidates Registered Yet</h4>
          <p className="text-muted">The election administrator has not added any candidates to the ballot.</p>
        </div>
      ) : (
        <div className="row g-4">
          {candidates.map((candidate) => {
            const isUserVotedCandidate = user?.isVoted && user?.votedCandidate === candidate._id;
            
            return (
              <div className="col-md-6 col-lg-4" key={candidate._id}>
                <div className={`card h-100 border-0 shadow-sm card-hover-effect ${isUserVotedCandidate ? 'border border-2 border-success' : ''}`}>
                  
                  {/* Top colored banner representing a ballot card */}
                  <div className="py-3 px-4 d-flex justify-content-between align-items-center text-white" style={{ background: isUserVotedCandidate ? 'var(--success-gradient)' : 'var(--primary-gradient)' }}>
                    <span className="font-bold text-uppercase tracking-wider small">
                      {candidate.party}
                    </span>
                    <span className="fs-3">{candidate.partySymbol}</span>
                  </div>

                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div className="mb-4">
                      <h4 className="font-bold text-dark mb-1">{candidate.name}</h4>
                      <p className="text-muted mb-0">Candidate for General Election</p>
                    </div>

                    <div>
                      {user?.isVoted ? (
                        isUserVotedCandidate ? (
                          <div className="bg-success-subtle text-success p-3 rounded text-center font-semibold" style={{ border: '1px dashed #198754' }}>
                            <i className="bi bi-patch-check-fill me-1"></i> You voted for this candidate
                          </div>
                        ) : (
                          <button className="btn btn-outline-secondary w-100 py-2.5" disabled style={{ borderRadius: '8px' }}>
                            Ballot Closed
                          </button>
                        )
                      ) : (
                        <button
                          className="btn btn-primary-custom w-100 py-2.5 d-flex align-items-center justify-content-center"
                          onClick={() => handleVote(candidate._id, candidate.name)}
                          disabled={voteLoading !== null}
                        >
                          {voteLoading === candidate._id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Casting Vote...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-box-arrow-down me-2"></i> Cast Vote
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
