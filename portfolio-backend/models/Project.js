const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  category: { type: String, trim: true, maxlength: 60, default: 'DEVELOPMENT PROJECT' },
  technologies: { type: [String], default: [], validate: v => v.length <= 20 },
  github: { type: String, trim: true, default: '' },
  demo: { type: String, trim: true, default: '' },
  image: { type: String, trim: true, default: '' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Project', projectSchema);
