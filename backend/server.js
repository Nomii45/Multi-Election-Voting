const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Simple base route to check if API is working
app.get('/', (req, res) => {
  res.send('Online Voting System API is running...');
});

// Routes configuration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));
app.use('/api/votes', require('./routes/voteRoutes'));

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
