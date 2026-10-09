const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const requireAdmin = require('../middleware/requireAdmin');
const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many login attempts. Please try again in 15 minutes.' } });
const cookieName = () => process.env.COOKIE_NAME || 'portfolio_admin';
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/', maxAge: 2 * 60 * 60 * 1000 });

// Intentionally no public signup route: the single admin is created by scripts/createAdmin.js.
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password || email.length > 254 || password.length > 200) return res.status(400).json({ message: 'Enter a valid email and password.' });
    const user = await User.findOne({ email }).select('+passwordHash');
    const valid = user && await bcrypt.compare(password, user.passwordHash);
    if (!valid || user.role !== 'admin') return res.status(401).json({ message: 'Email or password is incorrect.' });
    const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN || '2h' });
    res.cookie(cookieName(), token, cookieOptions()).json({ message: 'Signed in successfully.', user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
});
router.get('/me', requireAdmin, (req, res) => res.json({ user: { name: req.admin.name, email: req.admin.email, role: req.admin.role } }));
router.post('/logout', (req, res) => res.clearCookie(cookieName(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/' }).json({ message: 'Signed out.' }));
module.exports = router;
