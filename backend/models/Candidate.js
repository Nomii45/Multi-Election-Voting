const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter candidate name'],
    trim: true
  },
  party: {
    type: String,
    required: [true, 'Please enter party name'],
    trim: true,
    unique: true
  },
  partySymbol: {
    type: String,
    default: '🗳️' // Fallback icon/emoji
  },
  voteCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Candidate', CandidateSchema);
