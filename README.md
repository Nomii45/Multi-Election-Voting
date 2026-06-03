# 🗳️ Secure Online Voting System (MERN Stack)

A complete, responsive, and secure electronic voting application built using MongoDB, Express.js, React.js, and Node.js (MERN) with JSON Web Token (JWT) authentication and Bootstrap UI. 

This project is structured specifically to serve as a **University Final Year Project (FYP)** or software engineering course submission. It features clean code structure, thorough comments, and a simple design optimized for vivas and presentations.

---

## 🚀 Key Features
1. **User Registration & Validation**: Citizens register with their Name, Email, Password, Voter ID / National ID, and Age (validated backend/frontend to ensure $\ge 18$ years old).
2. **Dynamic JWT Authentication**: Secure logins for both Voters and Administrators, with authorization states persisting in browser localStorage.
3. **Admin Dashboard**: Administrator portal allowing candidate creation with customized party symbols/emojis.
4. **Interactive Ballot Box**: Voters can view the list of candidates and cast exactly **one (1) vote**.
5. **Anti-Double-Voting Mechanism**: The backend enforces the strict rule that a voter can only vote once. Voting buttons are immediately locked once a ballot is submitted.
6. **Live Results Dashboard**: Real-time tally board featuring percentage progress bars showing standing of each candidate, with auto-refreshing capabilities.
7. **Premium Responsive UI**: Elegant layout styled with Bootstrap 5, featuring subtle animations, hover states, and dark/vibrant gradient accents.

---

## 📁 Simple Project Directory Structure

```
online-voting-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB database connection configuration
│   ├── controllers/
│   │   ├── authController.js     # Handler logic for voter registration & login
│   │   ├── candidateController.js# Handler logic for adding & deleting candidates
│   │   └── voteController.js     # Logic for casting secure vote & computing tally results
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT token parsing & admin route guards
│   ├── models/
│   │   ├── Candidate.js          # Mongoose model for Election Candidates
│   │   └── User.js               # Mongoose model for Voters/Admins (hashing password)
│   ├── routes/
│   │   ├── authRoutes.js         # API endpoints for authentication
│   │   ├── candidateRoutes.js    # API endpoints for candidate operations
│   │   └── voteRoutes.js         # API endpoints for casting votes and results
│   ├── .env                      # Local server configuration credentials
│   ├── .env.example              # Sample environment credentials
│   ├── server.js                 # Express Application root & initialization script
│   └── package.json              # Backend dependencies configuration
│
└── frontend/
    ├── index.html                # Application root html loading fonts & icons
    ├── package.json              # Frontend dependencies and dev scripts
    ├── vite.config.js            # Build setup and backend proxy configuration
    └── src/
        ├── main.jsx              # Application entry point binding React/Bootstrap
        ├── index.css             # Main styling, color themes, and custom buttons
        ├── App.css               # Animation styling (fade-in, progress bars, etc.)
        ├── App.jsx               # Application routes and navigation wrapper
        ├── context/
        │   └── AuthContext.jsx   # State manager storing tokens and auth user details
        └── components/
            ├── Navbar.jsx        # Navigation bar (dynamic layout based on roles)
            ├── Login.jsx         # Access portal for both users and admins
            ├── Register.jsx      # Form for new user register (includes role selector)
            ├── CandidateList.jsx # Ballot box showing candidates and casting system
            ├── AdminDashboard.jsx# Admin panel for creating and deleting candidates
            └── Results.jsx       # Real-time election statistics and progress bars
```

---

## 🛠️ Installation & Setup Guide

### Prerequisites
Before running the application, make sure you have installed:
* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally on port `27017`)

---

### Step 1: Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Look at `.env.example` and create a `.env` file (this has been pre-configured for you):
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/online_voting_system
   JWT_SECRET=super_secret_key_for_jwt_voting_system_12345
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *(You should see a message: `Server running on port 5000` and `MongoDB Connected: 127.0.0.1`)*

---

### Step 2: Frontend Setup
1. Open a second terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *(This launches the client web app on [http://localhost:3000](http://localhost:3000))*

---

## 🎯 Step-by-Step Viva Evaluation Guide

Here is the exact sequence to demonstrate the system successfully to your examiners:

1. **Access Register Screen**:
   * Navigate to `http://localhost:3000/register`.
   * Register a new account. Select **System Administrator (Admin)** under "Registration Type".

2. **Add Candidates (Admin Flow)**:
   * Login as your new Admin account at `http://localhost:3000/login`.
   * You will land on the **Admin Dashboard**.
   * Add 3 candidates (e.g. *Dr. Sarah Jenkins* under *Democratic Alliance*, *Mark Logan* under *Reform Coalition*, etc.). Customize their logo emojis!

3. **Register Voters (User Flow)**:
   * Click **Logout**.
   * Navigate back to **Register**.
   * Create two voter accounts (type: **Voter**). Ensure you enter age $\ge 18$.
   * *Tip: Try entering an age less than 18, and watch the frontend/backend validation error display.*

4. **Cast Votes**:
   * Log in with Voter Account 1.
   * You will see the ballot card panel listing your added candidates.
   * Click **Cast Vote** for Candidate A. Confirm the warning prompt.
   * Notice your account badge changes to **VOTING COMPLETE** and you are locked out from voting again.
   * Logout and login as Voter Account 2. Vote for Candidate B (or Candidate A again).

5. **Monitor Live Results**:
   * Logout and login with your Admin account.
   * Click **View Live Results** in the Navbar or dashboard.
   * You will see the total vote count, percentages, active candidates, and a **Leading** badge highlighting the current winner in real-time.
