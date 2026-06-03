const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token valid for 30 days
  });
};

/**
 * @desc    Register a new voter user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, voterId, age, role } = req.body;

    // Check if user already exists with email or voter ID
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const voterIdExists = await User.findOne({ voterId });
    if (voterIdExists) {
      return res.status(400).json({ success: false, message: 'Voter ID is already registered' });
    }

    // Force default role to 'user' for safety unless it's explicitly 'admin'
    // For local project testing, we can allow creating admin via body role, but let's log it or handle it cleanly.
    // If it's a new system, it's nice to let them create admins easily or pre-determine based on env/first register.
    const userRole = role === 'admin' ? 'admin' : 'user';

    // Age validation (frontend does this but backend must double check)
    if (Number(age) < 18) {
      return res.status(400).json({ success: false, message: 'You must be at least 18 years old to register' });
    }

    // Create user in DB
    const user = await User.create({
      name,
      email,
      password,
      voterId,
      age,
      role: userRole
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id, user.role),
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
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id, user.role),
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
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser
};
