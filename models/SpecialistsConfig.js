const mongoose = require('mongoose');

const SpecialistsCategorySchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  options: { type: [String], default: [] }
}, { _id: false });

const SpecialistsConfigSchema = new mongoose.Schema({
  imageUrl: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  categories: { type: [SpecialistsCategorySchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpecialistsConfig', SpecialistsConfigSchema);

