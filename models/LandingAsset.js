const mongoose = require('mongoose');

const LandingAssetSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  label: { type: String, default: '' },
  section: { type: String, default: '' },
  url: { type: String, default: '' },
  publicId: { type: String, default: '' },
  alt: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LandingAsset', LandingAssetSchema);

