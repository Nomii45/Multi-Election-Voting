const User = require('../models/User');
const Candidate = require('../models/Candidate');

/**
 * @desc    Cast vote for a candidate
 * @route   POST /api/votes/:candidateId
 * @access  Private
 */
const castVote = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    const userId = req.user.id; // set by auth middleware

    // Check if candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    // Check user's current voting status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify if user is an admin - typically admins are regulators and don't vote
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Administrators are not allowed to cast votes' });
    }

    // Verify user hasn't voted already
    if (user.isVoted) {
      return res.status(400).json({ success: false, message: 'You have already cast your vote!' });
    }

    // Perform voting updates:
    // 1. Mark user as voted and link candidate
    user.isVoted = true;
    user.votedCandidate = candidate._id;
    await user.save();

    // 2. Increment candidate's vote count
    candidate.voteCount += 1;
    await candidate.save();

    res.json({
      success: true,
      message: 'Vote cast successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        voterId: user.voterId,
        role: user.role,
        isVoted: user.isVoted,
        votedCandidate: user.votedCandidate
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current voting results
 * @route   GET /api/votes/results
 * @access  Private/Admin
 */
const getResults = async (req, res, next) => {
  try {
    const candidates = await Candidate.find({}).sort({ voteCount: -1 });
    
    // Calculate total votes cast
    const totalVotes = candidates.reduce((acc, candidate) => acc + candidate.voteCount, 0);

    // Append percentage to results for presentation
    const results = candidates.map(c => {
      const percentage = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
      return {
        _id: c._id,
        name: c.name,
        party: c.party,
        partySymbol: c.partySymbol,
        voteCount: c.voteCount,
        percentage: `${percentage}%`
      };
    });

    res.json({
      success: true,
      totalVotes,
      results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  castVote,
  getResults
};
