require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
(async () => {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;
  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET || JWT_SECRET.length < 32) throw new Error('Set MONGO_URI, JWT_SECRET (32+ chars), ADMIN_EMAIL and ADMIN_PASSWORD in .env first.');
  if (ADMIN_PASSWORD.length < 12 || ADMIN_PASSWORD === 'replace-with-a-unique-strong-password') throw new Error('Set a unique ADMIN_PASSWORD of at least 12 characters.');
  await mongoose.connect(MONGO_URI);
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const existing = await User.findOne({ email });
  if (existing) {
    existing.name = ADMIN_NAME || existing.name;
    existing.passwordHash = passwordHash;
    existing.role = 'admin';
    await existing.save();
    console.log(`Admin password updated for ${email}`);
  } else {
    await User.create({ name: ADMIN_NAME || 'Portfolio Admin', email, passwordHash, role: 'admin' });
    console.log(`Admin account created for ${email}`);
  }
  await mongoose.disconnect();
})().catch(error => { console.error(error.message); process.exitCode = 1; mongoose.disconnect().catch(()=>{}); });
