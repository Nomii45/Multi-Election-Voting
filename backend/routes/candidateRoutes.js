const express = require('express');
const router = express.Router();
const { getCandidates, createCandidate, deleteCandidate } = require('../controllers/candidateController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all candidates (accessible to any authenticated user)
// Create a new candidate (Admin only)
router.route('/')
  .get(protect, getCandidates)
  .post(protect, admin, createCandidate);

// Delete candidate (Admin only)
router.route('/:id')
  .delete(protect, admin, deleteCandidate);

module.exports = router;
