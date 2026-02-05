const express = require('express');
const router = express.Router();
const LandingAsset = require('../models/LandingAsset');
const SpecialistsConfig = require('../models/SpecialistsConfig');
const {
  uploadLandingImages,
  getLandingImageUrl,
  deleteImage
} = require('../config/cloudinary');
const {
  getLandingDefaultByKey,
  mergeLandingAssetsForAdmin
} = require('../utils/landingAssets');
const { mergeSpecialistsConfig, defaultSpecialistsConfig } = require('../utils/specialistsConfig');

router.get('/', (req, res) => {
  res.redirect('/admin/landing');
});

// Landing Page Assets
router.get('/landing', async (req, res) => {
  try {
    const assets = await LandingAsset.find({});
    const mergedAssets = mergeLandingAssetsForAdmin(assets);

    res.render('pages/admin/landing', {
      title: 'Landing Assets - Admin',
      layout: 'layouts/minimal',
      extraStyles: ['/css/dashboard.css'],
      activePage: 'admin-landing',
      assets: mergedAssets
    });
  } catch (err) {
    console.error('Admin landing assets error:', err);
    req.flash('error_msg', 'Unable to load landing assets.');
    res.redirect('/dashboard');
  }
});

router.post('/landing/:key', uploadLandingImages.single('image'), async (req, res) => {
  try {
    const { key } = req.params;
    const defaults = getLandingDefaultByKey(key);

    if (!defaults) {
      req.flash('error_msg', 'Unknown landing asset.');
      return res.redirect('/admin/landing');
    }

    const alt = (req.body.alt || '').trim();
    let asset = await LandingAsset.findOne({ key });

    if (!asset) {
      asset = new LandingAsset({
        key,
        label: defaults.label,
        section: defaults.section,
        url: defaults.url,
        alt: defaults.alt
      });
    }

    asset.label = defaults.label;
    asset.section = defaults.section;

    if (alt) {
      asset.alt = alt;
    } else if (!asset.alt) {
      asset.alt = defaults.alt;
    }

    if (req.file) {
      if (asset.publicId) {
        await deleteImage(asset.publicId);
      }
      asset.url = getLandingImageUrl(req.file);
      asset.publicId = req.file.filename || req.file.public_id;
    }

    asset.updatedAt = new Date();
    await asset.save();

    req.flash('success_msg', 'Landing asset updated.');
    res.redirect('/admin/landing');
  } catch (err) {
    console.error('Update landing asset error:', err);
    req.flash('error_msg', 'Unable to update landing asset.');
    res.redirect('/admin/landing');
  }
});

// Specialists Section
router.get('/specialists', async (req, res) => {
  try {
    const storedConfig = await SpecialistsConfig.findOne({});
    const specialists = mergeSpecialistsConfig(storedConfig);

    res.render('pages/admin/specialists', {
      title: 'Specialists Section - Admin',
      layout: 'layouts/minimal',
      extraStyles: ['/css/dashboard.css'],
      specialists
    });
  } catch (err) {
    console.error('Admin specialists error:', err);
    req.flash('error_msg', 'Unable to load specialists section.');
    res.redirect('/dashboard');
  }
});

router.post('/specialists/image', uploadLandingImages.single('image'), async (req, res) => {
  try {
    let config = await SpecialistsConfig.findOne({});
    if (!config) {
      config = new SpecialistsConfig(defaultSpecialistsConfig);
    }

    const alt = (req.body.alt || '').trim();
    if (alt) {
      config.imageAlt = alt;
    }

    if (req.file) {
      if (config.imagePublicId) {
        await deleteImage(config.imagePublicId);
      }
      config.imageUrl = getLandingImageUrl(req.file);
      config.imagePublicId = req.file.filename || req.file.public_id;
    }

    config.updatedAt = new Date();
    await config.save();

    req.flash('success_msg', 'Specialists image updated.');
    res.redirect('/admin/specialists');
  } catch (err) {
    console.error('Update specialists image error:', err);
    req.flash('error_msg', 'Unable to update specialists image.');
    res.redirect('/admin/specialists');
  }
});

router.post('/specialists/options', async (req, res) => {
  try {
    const { categories } = req.body;
    const baseConfig = defaultSpecialistsConfig;
    let config = await SpecialistsConfig.findOne({});
    if (!config) {
      config = new SpecialistsConfig(baseConfig);
    }

    const updatedCategories = baseConfig.categories.map((category) => {
      const formCategory = categories?.[category.key] || {};
      const label = (formCategory.label || category.label).trim();
      const optionsText = (formCategory.options || '').toString();
      const options = optionsText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      return {
        key: category.key,
        label,
        options: options.length > 0 ? options : category.options
      };
    });

    config.categories = updatedCategories;
    config.updatedAt = new Date();
    await config.save();

    req.flash('success_msg', 'Specialists options updated.');
    res.redirect('/admin/specialists');
  } catch (err) {
    console.error('Update specialists options error:', err);
    req.flash('error_msg', 'Unable to update specialists options.');
    res.redirect('/admin/specialists');
  }
});

// ==========================================
// Gallery Video
// ==========================================
const GalleryVideo = require('../models/GalleryVideo');
const multer = require('multer');
const path = require('path');

// Video upload (local – Cloudinary free doesn't support video well)
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/landing'),
  filename: (req, file, cb) => cb(null, 'gallery-video-' + Date.now() + path.extname(file.originalname))
});
const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const ok = /mp4|webm|mov|avi/.test(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('Video files only'), ok);
  }
});

router.get('/video', async (req, res) => {
  const gv = await GalleryVideo.findOne({});
  res.render('pages/admin/video', {
    title: 'Gallery Video - Admin',
    layout: 'layouts/minimal',
    extraStyles: ['/css/dashboard.css'],
    video: gv
  });
});

router.post('/video', uploadVideo.single('video'), async (req, res) => {
  try {
    let gv = await GalleryVideo.findOne({});
    if (!gv) gv = new GalleryVideo();

    if (req.file) {
      gv.url = '/uploads/landing/' + req.file.filename;
      gv.publicId = req.file.filename;
    }
    gv.updatedAt = new Date();
    await gv.save();

    req.flash('success_msg', 'Gallery video updated.');
    res.redirect('/admin/video');
  } catch (err) {
    console.error('Admin video upload error:', err);
    req.flash('error_msg', 'Unable to upload video.');
    res.redirect('/admin/video');
  }
});

router.post('/video/delete', async (req, res) => {
  try {
    await GalleryVideo.deleteMany({});
    req.flash('success_msg', 'Gallery video removed. Image fallback will be used.');
    res.redirect('/admin/video');
  } catch (err) {
    console.error('Admin video delete error:', err);
    req.flash('error_msg', 'Unable to delete video.');
    res.redirect('/admin/video');
  }
});

// ==========================================
// Contact Messages
// ==========================================
const ContactMessage = require('../models/ContactMessage');

router.get('/messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.render('pages/admin/messages', {
      title: 'Contact Messages - Admin',
      layout: 'layouts/minimal',
      extraStyles: ['/css/dashboard.css'],
      messages
    });
  } catch (err) {
    console.error('Admin messages error:', err);
    req.flash('error_msg', 'Unable to load messages.');
    res.redirect('/admin');
  }
});

router.post('/messages/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await ContactMessage.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin/messages');
  } catch (err) {
    console.error('Admin message status error:', err);
    res.redirect('/admin/messages');
  }
});

router.post('/messages/:id/delete', async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Message deleted.');
    res.redirect('/admin/messages');
  } catch (err) {
    console.error('Admin message delete error:', err);
    res.redirect('/admin/messages');
  }
});

module.exports = router;

