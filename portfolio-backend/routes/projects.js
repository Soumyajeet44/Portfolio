const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const requireAdmin = require('../middleware/requireAdmin');
const router = express.Router();
const validUrl = (value) => { if (!value) return true; try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol); } catch { return false; } };
function normalize(body) {
  const technologies = Array.isArray(body.technologies) ? body.technologies : [];
  return {
    title: String(body.title || '').trim(), description: String(body.description || '').trim(),
    category: String(body.category || 'DEVELOPMENT PROJECT').trim().slice(0, 60),
    technologies: technologies.map(x => String(x).trim()).filter(Boolean).slice(0, 20),
    github: String(body.github || '').trim(), demo: String(body.demo || '').trim(), image: String(body.image || '').trim(), featured: body.featured === true || body.featured === 'true',
  };
}
function validate(project) {
  if (project.title.length < 2 || project.description.length < 10) return 'Add a title and a description of at least 10 characters.';
  if (![project.github, project.demo, project.image].every(validUrl)) return 'Links must be valid HTTP or HTTPS URLs.';
  return null;
}
router.get('/', async (req, res, next) => { try { const projects = await Project.find().sort({ featured: -1, createdAt: -1 }).lean(); res.json(projects); } catch (e) { next(e); } });
router.get('/admin/all', requireAdmin, async (req, res, next) => { try { res.json(await Project.find().sort({ createdAt: -1 }).lean()); } catch (e) { next(e); } });
router.post('/', requireAdmin, async (req, res, next) => { try { const data = normalize(req.body); const problem = validate(data); if (problem) return res.status(400).json({ message: problem }); const project = await Project.create(data); res.status(201).json({ message: 'Project created.', project }); } catch (e) { next(e); } });
router.put('/:id', requireAdmin, async (req, res, next) => { try { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' }); const data = normalize(req.body); const problem = validate(data); if (problem) return res.status(400).json({ message: problem }); const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }); if (!project) return res.status(404).json({ message: 'Project not found.' }); res.json({ message: 'Project updated.', project }); } catch (e) { next(e); } });
router.delete('/:id', requireAdmin, async (req, res, next) => { try { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' }); const project = await Project.findByIdAndDelete(req.params.id); if (!project) return res.status(404).json({ message: 'Project not found.' }); res.json({ message: 'Project deleted.' }); } catch (e) { next(e); } });
module.exports = router;
