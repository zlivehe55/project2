const mongoose = require('mongoose');

const galleryVideoSchema = new mongoose.Schema({
  url: { type: String, default: '' },
  publicId: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryVideo', galleryVideoSchema);

