import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import passport from 'passport';
import User from '../models/User.js';
import { generateUsername } from 'unique-username-generator';
import { sendVerificationEmail } from '../utils/sendEmail.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const username = generateUsername('', 3);

    const token = crypto.randomBytes(32).toString('hex');

    console.log(token);
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      verificationToken: token,
    });

    await newUser.save();

    try {
      // Send verification email
      await sendVerificationEmail(email, token);
    } catch (error) {
      console.log(error);
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logout successful' });
  });
});

// Get Authenticated User
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Verify Email
router.get('/verify-email', async (req, res) => {
  await dbConnect();

  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user)
      return res.status(400).json({ error: 'Invalid or expired token' });

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.json({
      message: 'Email successfully verified! You can now log in.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
