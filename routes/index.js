const express = require('express');
const router = express.Router();
const { getStyles, getRoomTypes } = require('../utils/homedesigns');

// Landing Page
router.get('/', (req, res) => {
  res.render('pages/landing', {
    title: 'CraftyCrib - AI-Powered Interior Design',
    layout: 'layouts/landing',
    styles: getStyles(),
    roomTypes: getRoomTypes()
  });
});

// About Page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About Us - CraftyCrib'
  });
});

// How It Works
router.get('/how-it-works', (req, res) => {
  res.render('pages/how-it-works', {
    title: 'How It Works - CraftyCrib'
  });
});

// Pricing Page
router.get('/pricing', (req, res) => {
  res.render('pages/pricing', {
    title: 'Pricing - CraftyCrib',
    plans: [
      {
        name: 'Free',
        price: 0,
        period: 'forever',
        features: [
          '3 AI generations per month',
          'Basic design styles',
          'Standard quality renders',
          'Save up to 2 projects',
          'Community support'
        ],
        cta: 'Get Started',
        popular: false
      },
      {
        name: 'Pro',
        price: 19,
        period: 'month',
        features: [
          '50 AI generations per month',
          'All design styles',
          'HD quality renders',
          'Unlimited projects',
          'Materials list & suppliers',
          'Connect with contractors',
          'Priority support'
        ],
        cta: 'Start Free Trial',
        popular: true
      },
      {
        name: 'Premium',
        price: 49,
        period: 'month',
        features: [
          'Unlimited AI generations',
          'All design styles + exclusive',
          'Ultra HD renders',
          'Unlimited projects',
          'Advanced materials analysis',
          'Priority contractor matching',
          'Cost estimation tools',
          'PDF export',
          'Dedicated support'
        ],
        cta: 'Go Premium',
        popular: false
      }
    ]
  });
});

// Contact Page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us - CraftyCrib'
  });
});

// Contact Form Submit
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  // TODO: Send email or save to database
  req.flash('success_msg', 'Thank you for your message! We will get back to you soon.');
  res.redirect('/contact');
});

// Privacy Policy
router.get('/privacy', (req, res) => {
  res.render('pages/privacy', {
    title: 'Privacy Policy - CraftyCrib'
  });
});

// Terms of Service
router.get('/terms', (req, res) => {
  res.render('pages/terms', {
    title: 'Terms of Service - CraftyCrib'
  });
});

module.exports = router;

