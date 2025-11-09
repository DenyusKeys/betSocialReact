import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();


// REGISTER A NEW USER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body; // Grab registration data

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Create a new user instance (password is hashed automatically via pre-save hook)
    const user = new User({ username, email, password });
    await user.save();

    // Successful Registration
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: err.message });
  }
});


// LOGIN EXISTING USER
// Passport automatically handles checking email/password using the LocalStrategy
router.post('/login', passport.authenticate('local'), (req, res) => {
  // If this function runs, authentication succeeded
  res.json({ message: 'Logged in successfully', user: req.user });
});



// LOGOUT USER
router.get('/logout', (req, res) => {
  // Passport adds req.logout() to end the session
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});



// CHECK CURRENT SESSION
router.get('/me', (req, res) => {
  // req.isAuthenticated() is a Passport helper that checks if the user is logged in
  if (req.isAuthenticated()) {
    // Send back the logged-in user's info
    res.json(req.user);
  } else {
    // If not logged in, return a 401 Unauthorized response
    res.status(401).json({ message: 'Not authenticated' });
  }
});

export default router;
