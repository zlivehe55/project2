const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { ensureAuthenticated, ensureProjectOwner } = require('../middleware/auth');
const Project = require('../models/Project');
const { generateDesign, getStyles, getRoomTypes } = require('../utils/homedesigns');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/projects');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// List all projects
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.render('pages/projects/index', {
      title: 'My Projects - CraftyCrib',
      projects
    });
  } catch (err) {
    console.error('Projects list error:', err);
    req.flash('error_msg', 'An error occurred');
    res.redirect('/dashboard');
  }
});

// New Project Form
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('pages/projects/new', {
    title: 'New Project - CraftyCrib',
    styles: getStyles(),
    roomTypes: getRoomTypes()
  });
});

// Create Project
router.post('/', ensureAuthenticated, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      roomType,
      style,
      budgetMin,
      budgetMax,
      length,
      width,
      height,
      colors,
      materials,
      mustHave,
      mustAvoid,
      priorityQuality,
      priorityPrice,
      prioritySpeed,
      isDIY
    } = req.body;

    // Generate share token
    const shareToken = crypto.randomBytes(16).toString('hex');

    // Process uploaded images
    const originalImages = req.files ? req.files.map(file => ({
      url: `/uploads/projects/${file.filename}`,
      uploadedAt: new Date()
    })) : [];

    const project = new Project({
      user: req.user.id,
      title,
      description,
      roomType,
      style,
      budget: {
        min: budgetMin ? parseFloat(budgetMin) : undefined,
        max: budgetMax ? parseFloat(budgetMax) : undefined
      },
      dimensions: {
        length: length ? parseFloat(length) : undefined,
        width: width ? parseFloat(width) : undefined,
        height: height ? parseFloat(height) : undefined
      },
      originalImages,
      preferences: {
        colors: colors ? colors.split(',').map(c => c.trim()) : [],
        materials: materials ? materials.split(',').map(m => m.trim()) : [],
        mustHave: mustHave ? mustHave.split(',').map(m => m.trim()) : [],
        mustAvoid: mustAvoid ? mustAvoid.split(',').map(m => m.trim()) : []
      },
      priorities: {
        quality: priorityQuality ? parseInt(priorityQuality) : 3,
        price: priorityPrice ? parseInt(priorityPrice) : 3,
        speed: prioritySpeed ? parseInt(prioritySpeed) : 3
      },
      isDIY: isDIY === 'on',
      shareToken,
      status: 'draft'
    });

    await project.save();

    req.flash('success_msg', 'Project created successfully!');
    res.redirect(`/projects/${project._id}`);
  } catch (err) {
    console.error('Create project error:', err);
    req.flash('error_msg', 'An error occurred creating the project');
    res.redirect('/projects/new');
  }
});

// View Project
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('contractorRequests.contractor');

    if (!project) {
      req.flash('error_msg', 'Project not found');
      return res.redirect('/projects');
    }

    res.render('pages/projects/view', {
      title: `${project.title} - CraftyCrib`,
      project,
      styles: getStyles(),
      roomTypes: getRoomTypes()
    });
  } catch (err) {
    console.error('View project error:', err);
    req.flash('error_msg', 'An error occurred');
    res.redirect('/projects');
  }
});

// Edit Project Form
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      req.flash('error_msg', 'Project not found');
      return res.redirect('/projects');
    }

    res.render('pages/projects/edit', {
      title: `Edit ${project.title} - CraftyCrib`,
      project,
      styles: getStyles(),
      roomTypes: getRoomTypes()
    });
  } catch (err) {
    console.error('Edit project error:', err);
    req.flash('error_msg', 'An error occurred');
    res.redirect('/projects');
  }
});

// Update Project
router.put('/:id', ensureAuthenticated, upload.array('images', 5), async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      req.flash('error_msg', 'Project not found');
      return res.redirect('/projects');
    }

    const {
      title,
      description,
      roomType,
      style,
      budgetMin,
      budgetMax,
      visibility
    } = req.body;

    project.title = title;
    project.description = description;
    project.roomType = roomType;
    project.style = style;
    project.budget.min = budgetMin ? parseFloat(budgetMin) : undefined;
    project.budget.max = budgetMax ? parseFloat(budgetMax) : undefined;
    project.visibility = visibility;

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        project.originalImages.push({
          url: `/uploads/projects/${file.filename}`,
          uploadedAt: new Date()
        });
      });
    }

    await project.save();

    req.flash('success_msg', 'Project updated successfully');
    res.redirect(`/projects/${project._id}`);
  } catch (err) {
    console.error('Update project error:', err);
    req.flash('error_msg', 'An error occurred');
    res.redirect(`/projects/${req.params.id}/edit`);
  }
});

// Delete Project
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    req.flash('success_msg', 'Project deleted successfully');
    res.redirect('/projects');
  } catch (err) {
    console.error('Delete project error:', err);
    req.flash('error_msg', 'An error occurred');
    res.redirect('/projects');
  }
});

// Generate AI Design
router.post('/:id/generate', ensureAuthenticated, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.originalImages || project.originalImages.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one image first' });
    }

    // Update status to generating
    project.status = 'generating';
    await project.save();

    // Get the first image URL
    const imageUrl = `${process.env.APP_URL}${project.originalImages[0].url}`;

    // Generate design using HomeDesigns.AI
    const result = await generateDesign({
      imageUrl,
      roomType: project.roomType,
      style: project.style || 'modern',
      quality: req.user.isPremium ? 'hd' : 'standard'
    });

    if (result.success) {
      // Add to design variants
      project.designVariants.push({
        name: `${project.style || 'Modern'} Design`,
        style: project.style,
        imageUrl: result.imageUrl,
        thumbnailUrl: result.thumbnailUrl,
        aiParameters: {
          roomType: project.roomType,
          style: project.style,
          generationId: result.generationId
        }
      });

      project.status = 'completed';
      project.aiGenerationHistory.push({
        parameters: { roomType: project.roomType, style: project.style },
        success: true
      });

      await project.save();

      res.json({
        success: true,
        design: project.designVariants[project.designVariants.length - 1]
      });
    } else {
      project.status = 'pending';
      project.aiGenerationHistory.push({
        parameters: { roomType: project.roomType, style: project.style },
        success: false,
        errorMessage: result.error
      });
      await project.save();

      res.status(500).json({
        success: false,
        error: result.error || 'Failed to generate design'
      });
    }
  } catch (err) {
    console.error('Generate design error:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Share Project (Public View)
router.get('/share/:token', async (req, res) => {
  try {
    const project = await Project.findOne({ shareToken: req.params.token })
      .populate('user', 'firstName lastName');

    if (!project) {
      return res.status(404).render('pages/404', {
        title: 'Project Not Found'
      });
    }

    res.render('pages/projects/shared', {
      title: `${project.title} - CraftyCrib`,
      layout: 'layouts/minimal',
      project
    });
  } catch (err) {
    console.error('Share project error:', err);
    res.status(500).render('pages/error', {
      title: 'Error'
    });
  }
});

module.exports = router;

