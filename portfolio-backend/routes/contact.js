const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const requireAdmin = require('../middleware/requireAdmin');
const router = express.Router();
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many messages from this connection. Please try again later.' } });
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, message, website } = req.body;
    if (website) return res.status(200).json({ message: 'Thanks for your message.' }); // honeypot: silently discard bots
    const clean = { name: String(name || '').trim(), email: String(email || '').trim().toLowerCase(), message: String(message || '').trim() };
    if (clean.name.length < 2 || clean.name.length > 80 || !emailPattern.test(clean.email) || clean.email.length > 254 || clean.message.length < 10 || clean.message.length > 3000) return res.status(400).json({ message: 'Please check your name, email, and message. Messages must be 10–3000 characters.' });
    await Contact.create(clean);
    res.status(201).json({ message: 'Message received. Thank you for reaching out.' });
  } catch (e) { next(e); }
});
router.get('/admin/messages', requireAdmin, async (req, res, next) => { try { res.json(await Contact.find().sort({ createdAt: -1 }).limit(200).lean()); } catch (e) { next(e); } });
router.delete('/admin/messages/:id', requireAdmin, async (req, res, next) => { try { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid message ID.' }); const result = await Contact.findByIdAndDelete(req.params.id); if (!result) return res.status(404).json({ message: 'Message not found.' }); res.json({ message: 'Message deleted.' }); } catch (e) { next(e); } });
module.exports = router;
