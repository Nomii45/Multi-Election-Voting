const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  voterId: {
    type: String,
    required: [true, 'Please enter your Voter ID / National ID'],
    unique: true,
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please enter your age'],
    min: [18, 'You must be at least 18 years old to vote']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVoted: {
    type: Boolean,
    default: false
  },
  votedCandidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    default: null
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt before saving user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
