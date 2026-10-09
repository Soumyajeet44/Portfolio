require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = Number(process.env.PORT || 5000);
const origins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173').split(',').map(x => x.trim()).filter(Boolean);
if (!process.env.MONGO_URI) console.warn('MONGO_URI is not configured.');
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) console.warn('JWT_SECRET must be at least 32 characters before deployment.');
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin(origin, callback) { if (!origin || origins.includes(origin)) return callback(null, true); return callback(new Error('Origin not allowed by CORS.')); }, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type'] }));
app.use(express.json({ limit: '30kb' }));
app.use(cookieParser());
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact', require('./routes/contact'));
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err.name || 'Error', err.message || err);
  if (err.message === 'Origin not allowed by CORS.') return res.status(403).json({ message: err.message });
  if (err.name === 'ValidationError') return res.status(400).json({ message: 'Please check the submitted information.' });
  if (err.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
  return res.status(500).json({ message: 'Something went wrong on the server.' });
});

async function start() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required. Copy .env.example to .env and configure it.');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET is required and must be at least 32 characters.');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  app.listen(PORT, () => console.log(`Portfolio API listening on port ${PORT}`));
}
start().catch(error => { console.error('Could not start API:', error.message); process.exit(1); });
