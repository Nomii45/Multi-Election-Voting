const Candidate = require('../models/Candidate');

/**
 * @desc    Create a new candidate
 * @route   POST /api/candidates
 * @access  Private/Admin
 */
const createCandidate = async (req, res, next) => {
  try {
    const { name, party, partySymbol } = req.body;

    if (!name || !party) {
      return res.status(400).json({ success: false, message: 'Please provide candidate name and party' });
    }

    // Check if party is already registered
    const partyExists = await Candidate.findOne({ party });
    if (partyExists) {
      return res.status(400).json({ success: false, message: 'This party is already registered' });
    }

    const candidate = await Candidate.create({
      name,
      party,
      partySymbol: partySymbol || '🗳️'
    });

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      candidate
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all candidates
 * @route   GET /api/candidates
 * @access  Private
 */
const getCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find({}).sort({ name: 1 });
    res.json({
      success: true,
      candidates
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a candidate
 * @route   DELETE /api/candidates/:id
 * @access  Private/Admin
 */
const deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    await Candidate.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCandidate,
  getCandidates,
  deleteCandidate
};
