require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const starterProjects = [
  {
    title: 'CertiFlow', category: 'FULL-STACK WEB APP',
    description: 'A certificate workflow application focused on making certificate generation and management more efficient.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/Soumyajeet44/certiflow', demo: '', featured: true,
  },
  {
    title: 'Developer Portfolio', category: 'PERSONAL WEBSITE',
    description: 'A responsive developer portfolio with a MERN backend, protected admin area, project management and contact inbox.',
    technologies: ['React', 'Express', 'MongoDB', 'Node.js'],
    github: 'https://github.com/Soumyajeet44/Portfolio', demo: '', featured: true,
  },
  {
    title: 'Inventory Management System', category: 'DATABASE APPLICATION',
    description: 'An inventory management project exploring product records, database operations and structured data workflows.',
    technologies: ['Python', 'SQLite', 'PHP', 'MySQL'],
    github: 'https://github.com/Soumyajeet44', demo: '', featured: false,
  },
];
(async () => {
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in .env first.');
  await mongoose.connect(process.env.MONGO_URI);
  for (const project of starterProjects) {
    const exists = await Project.findOne({ title: project.title });
    if (!exists) await Project.create(project);
    console.log(`${exists ? 'Already exists' : 'Added'}: ${project.title}`);
  }
  await mongoose.disconnect();
})().catch(error => { console.error(error.message); process.exitCode = 1; mongoose.disconnect().catch(()=>{}); });
