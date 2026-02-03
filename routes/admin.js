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

module.exports = router;

