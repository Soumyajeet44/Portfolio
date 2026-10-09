const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME || 'portfolio_admin'];
    if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const user = await User.findById(payload.sub).select('_id name email role');
    if (!user || user.role !== 'admin') return res.status(401).json({ message: 'Your session is no longer valid.' });
    req.admin = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
};
