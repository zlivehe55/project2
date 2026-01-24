const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Project = require('../models/Project');
const Contractor = require('../models/Contractor');
const { Message, Conversation } = require('../models/Message');

// Dashboard Home - Route based on role
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    if (req.user.role === 'contractor') {
      // Contractor Dashboard
      const contractor = await Contractor.findOne({ user: req.user.id });
      const availableProjects = await Project.find({
        visibility: 'contractors',
        status: { $in: ['completed', 'pending'] }
      }).populate('user', 'firstName lastName').limit(10);

      res.render('pages/dashboard/contractor', {
        title: 'Contractor Dashboard - CraftyCrib',
        contractor,
        availableProjects
      });
    } else {
      // Client Dashboard
      const projects = await Project.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .limit(10);
      
      const stats = {
        totalProjects: await Project.countDocuments({ user: req.user.id }),
        completedDesigns: await Project.countDocuments({ user: req.user.id, status: 'completed' }),
        inProgress: await Project.countDocuments({ user: req.user.id, status: { $in: ['generating', 'in-progress'] } })
      };

      res.render('pages/dashboard/client', {
        title: 'My Dashboard - CraftyCrib',
        projects,
        stats
      });
    }
  } catch (err) {
    console.error('Dashboard error:', err);
    req.flash('error_msg', 'An error occurred loading the dashboard');
    res.redirect('/');
  }
});

// Profile Settings
router.get('/settings', ensureAuthenticated, (req, res) => {
  res.render('pages/dashboard/settings', {
    title: 'Account Settings - CraftyCrib'
  });
});

// Update Profile
router.post('/settings', ensureAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    await req.user.updateOne({
      firstName,
      lastName,
      phone
    });

    req.flash('success_msg', 'Profile updated successfully');
    res.redirect('/dashboard/settings');
  } catch (err) {
    console.error('Update profile error:', err);
    req.flash('error_msg', 'An error occurred');
    res.redirect('/dashboard/settings');
  }
});

// Messages
router.get('/messages', ensureAuthenticated, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'firstName lastName avatar')
      .populate('project', 'title')
      .sort({ updatedAt: -1 });

    res.render('pages/dashboard/messages', {
      title: 'Messages - CraftyCrib',
      conversations
    });
  } catch (err) {
    console.error('Messages error:', err);
    req.flash('error_msg', 'An error occurred');
    res.redirect('/dashboard');
  }
});

// Single Conversation
router.get('/messages/:id', ensureAuthenticated, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user.id
    }).populate('participants', 'firstName lastName avatar');

    if (!conversation) {
      req.flash('error_msg', 'Conversation not found');
      return res.redirect('/dashboard/messages');
    }

    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'firstName lastName avatar')
      .sort({ createdAt: 1 });

    res.render('pages/dashboard/conversation', {
      title: 'Conversation - CraftyCrib',
      conversation,
      messages
    });
  } catch (err) {
    console.error('Conversation error:', err);
    req.flash('error_msg', 'An error occurred');
    res.redirect('/dashboard/messages');
  }
});

// Send Message
router.post('/messages/:id', ensureAuthenticated, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const message = new Message({
      conversation: conversation._id,
      sender: req.user.id,
      content: req.body.content
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = {
      content: req.body.content,
      sender: req.user.id,
      createdAt: new Date()
    };
    await conversation.save();

    res.redirect(`/dashboard/messages/${conversation._id}`);
  } catch (err) {
    console.error('Send message error:', err);
    req.flash('error_msg', 'Failed to send message');
    res.redirect(`/dashboard/messages/${req.params.id}`);
  }
});

// Notifications
router.get('/notifications', ensureAuthenticated, (req, res) => {
  res.render('pages/dashboard/notifications', {
    title: 'Notifications - CraftyCrib'
  });
});

module.exports = router;

