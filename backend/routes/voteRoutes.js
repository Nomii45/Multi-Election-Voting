const express = require('express');
const router = express.Router();
const { castVote, getResults } = require('../controllers/voteController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route to get results (Admin only)
// Note: Must be defined before '/:candidateId' so 'results' isn't parsed as a candidateId parameter!
router.get('/results', protect, admin, getResults);

// Route to cast vote (Authenticated users)
router.post('/:candidateId', protect, castVote);

module.exports = router;
