const express = require('express');
const router = express.Router();
const { getStyles, getRoomTypes } = require('../utils/homedesigns');
const Project = require('../models/Project');

// Landing Page
router.get('/', (req, res) => {
  res.render('pages/landing', {
    title: 'CraftyCrib - AI-Powered Interior Design & Renovation Platform',
    metaDescription: 'Transform your living space with AI-powered interior design. Upload a photo of your room, get instant photorealistic 3D mockups, and connect with professional contractors to bring your vision to life.',
    keywords: 'AI interior design, home renovation, room visualization, 3D mockups, contractor marketplace, smart home design, virtual staging, interior decorating, home improvement, renovation planning',
    canonicalUrl: 'https://craftycrib.com',
    layout: 'layouts/landing',
    styles: getStyles(),
    roomTypes: getRoomTypes()
  });
});

// About Page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About Us - CraftyCrib | AI Interior Design Platform',
    metaDescription: 'Learn about CraftyCrib, the innovative AI-powered interior design platform connecting homeowners with stunning visualizations and professional contractors.',
    layout: 'layouts/landing'
  });
});

// How It Works
router.get('/how-it-works', (req, res) => {
  res.render('pages/how-it-works', {
    title: 'How It Works - CraftyCrib | 3 Simple Steps to Your Dream Room',
    metaDescription: 'Discover how CraftyCrib works: Upload a photo, let AI generate stunning designs, and connect with contractors to make it real. Start transforming your space today.',
    layout: 'layouts/landing'
  });
});

// Pricing Page
router.get('/pricing', (req, res) => {
  const plans = {
    // Plan 1: Régulier (Gratuit)
    regular: {
      id: 'regular',
      name: 'Régulier',
      subtitle: 'Pour commencer',
      price: 0,
      period: 'gratuit',
      description: 'Démarrez gratuitement avec 3 générations IA. Parfait pour tester la plateforme.',
      features: [
        { text: '3 générations IA', included: true },
        { text: '2 styles de design', included: true },
        { text: 'Qualité Ultra HD', included: true },
        { text: 'Jusqu\'à 2 projets', included: true },
        { text: 'Connexion entrepreneur', included: true },
        { text: 'Génération supplémentaire: 3,99$', included: true, addon: true },
        { text: 'Téléchargement PDF: 1,99$', included: true, addon: true }
      ],
      bonus: '🎁 Obtenez 30 générations gratuites + projets illimités en concluant un projet avec un entrepreneur!',
      cta: 'Commencer gratuitement',
      ctaLink: '/auth/register',
      popular: false
    },
    // Plan 2: Avancé - 29,99$ CAD/mois
    advanced: {
      id: 'advanced',
      name: 'Avancé',
      subtitle: 'Le plus populaire',
      price: 29.99,
      period: '/mois',
      generations: 50,
      description: '50 générations IA par mois. Idéal pour les rénovations actives et les projets multiples.',
      features: [
        { text: '50 générations IA / mois', included: true },
        { text: 'Tous les styles de design', included: true },
        { text: 'Qualité Ultra HD', included: true },
        { text: 'Projets illimités', included: true },
        { text: 'Connexion entrepreneur', included: true },
        { text: 'Téléchargement PDF inclus', included: true },
        { text: '3 générations supplémentaires: 3,99$', included: true, addon: true }
      ],
      cta: 'Choisir Avancé',
      ctaLink: '/auth/register?plan=advanced',
      highlight: 'Plus populaire',
      popular: true,
      badge: '⭐ Recommandé'
    },
    // Plan 3: Premium - 79,99$ CAD/mois
    premium: {
      id: 'premium',
      name: 'Premium',
      subtitle: 'Sans limites',
      price: 79.99,
      period: '/mois',
      description: 'Générations illimitées pour les professionnels et les grands projets.',
      features: [
        { text: 'Générations IA illimitées', included: true },
        { text: 'Tous les styles de design', included: true },
        { text: 'Qualité Ultra HD', included: true },
        { text: 'Projets illimités', included: true },
        { text: 'Connexion entrepreneur', included: true },
        { text: 'Téléchargement PDF inclus', included: true },
        { text: 'Support prioritaire', included: true }
      ],
      cta: 'Choisir Premium',
      ctaLink: '/auth/register?plan=premium',
      popular: false,
      badge: '👑 Pro'
    }
  };

  res.render('pages/pricing', {
    title: 'Pricing - CraftyCrib | AI Interior Design Plans',
    metaDescription: 'Choose the perfect CraftyCrib plan. Free with contractor partners, or pay-as-you-go for DIY projects. Start with 3 free AI generations.',
    keywords: 'interior design pricing, AI design cost, renovation platform pricing, home design subscription',
    layout: 'layouts/landing',
    plans
  });
});

// Contact Page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact Us - CraftyCrib | Get in Touch',
    metaDescription: 'Have questions about CraftyCrib? Contact our team for support, partnerships, or feedback. We\'re here to help you transform your space.',
    layout: 'layouts/landing'
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
    title: 'Privacy Policy - CraftyCrib',
    metaDescription: 'Read CraftyCrib\'s privacy policy. Learn how we protect your data, handle your information, and maintain your privacy while using our AI interior design platform.',
    layout: 'layouts/landing'
  });
});

// Terms of Service
router.get('/terms', (req, res) => {
  res.render('pages/terms', {
    title: 'Terms of Service - CraftyCrib',
    metaDescription: 'CraftyCrib terms of service. Understand the rules and guidelines for using our AI-powered interior design platform.',
    layout: 'layouts/landing'
  });
});

// ========================================
// PUBLIC GALLERY - Important for SEO
// ========================================

// Gallery Page - Public designs
router.get('/gallery', async (req, res) => {
  try {
    const { style, room, sort, page = 1 } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isPublished: true, visibility: 'public' };
    
    if (style) {
      query.style = style;
    }
    if (room) {
      query.roomType = room;
    }

    // Sort options
    let sortOption = { publishedAt: -1 }; // Default: newest
    if (sort === 'popular') {
      sortOption = { likes: -1 };
    } else if (sort === 'views') {
      sortOption = { views: -1 };
    }

    const projects = await Project.find(query)
      .populate('user', 'firstName lastName')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.render('pages/gallery', {
      title: 'Design Gallery - AI Interior Design Inspiration | CraftyCrib',
      metaDescription: 'Browse stunning AI-generated interior designs. Get inspiration for your home renovation from our community gallery of living rooms, bedrooms, kitchens, and more.',
      keywords: 'interior design gallery, AI design inspiration, room makeover ideas, home renovation inspiration, living room designs, bedroom designs',
      canonicalUrl: 'https://craftycrib.com/gallery',
      layout: 'layouts/landing',
      projects,
      styles: getStyles(),
      roomTypes: getRoomTypes(),
      filters: { style, room, sort },
      pagination: {
        page: parseInt(page),
        totalPages,
        total
      }
    });
  } catch (err) {
    console.error('Gallery error:', err);
    req.flash('error_msg', 'An error occurred loading the gallery');
    res.redirect('/');
  }
});

// Single Public Project - Important for SEO
router.get('/gallery/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ 
      publicSlug: req.params.slug,
      isPublished: true 
    }).populate('user', 'firstName lastName');

    if (!project) {
      return res.status(404).render('pages/404', {
        title: 'Design Not Found - CraftyCrib',
        layout: 'layouts/minimal'
      });
    }

    // Increment views
    project.views++;
    await project.save();

    // Get related projects
    const relatedProjects = await Project.find({
      _id: { $ne: project._id },
      isPublished: true,
      $or: [
        { style: project.style },
        { roomType: project.roomType }
      ]
    })
      .limit(4)
      .populate('user', 'firstName lastName');

    // Get the featured image for SEO
    const featuredImage = project.featuredImage || 
      (project.designVariants?.length > 0 ? project.designVariants[0].imageUrl : null) ||
      (project.originalImages?.length > 0 ? project.originalImages[0].url : null);

    res.render('pages/gallery-single', {
      title: `${project.title} - ${project.style} ${project.roomType} Design | CraftyCrib`,
      metaDescription: project.description.substring(0, 155) + '...',
      keywords: `${project.style} design, ${project.roomType} design, AI interior design, ${project.tags?.join(', ') || 'home renovation'}`,
      canonicalUrl: `https://craftycrib.com/gallery/${project.publicSlug}`,
      ogImage: featuredImage,
      layout: 'layouts/landing',
      project,
      relatedProjects,
      styles: getStyles()
    });
  } catch (err) {
    console.error('Gallery single error:', err);
    res.redirect('/gallery');
  }
});

// ========================================
// SITEMAP & ROBOTS.TXT
// ========================================

// Sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.APP_URL || 'https://craftycrib.com';
    
    // Get all public projects for sitemap
    const publicProjects = await Project.find({ 
      isPublished: true, 
      visibility: 'public' 
    }).select('publicSlug updatedAt roomType style');

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/pricing</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/gallery</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/contractors</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Gallery Categories -->
  ${getStyles().map(style => `
  <url>
    <loc>${baseUrl}/gallery?style=${style.id}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  ${getRoomTypes().map(room => `
  <url>
    <loc>${baseUrl}/gallery?room=${room.id}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  <!-- Public Projects -->
  ${publicProjects.map(project => `
  <url>
    <loc>${baseUrl}/gallery/${project.publicSlug}</loc>
    <lastmod>${project.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://craftycrib.com';
  
  const robotsTxt = `# CraftyCrib Robots.txt
User-agent: *
Allow: /
Allow: /gallery
Allow: /pricing
Allow: /contractors
Allow: /about
Allow: /contact

# Disallow private/authenticated areas
Disallow: /dashboard
Disallow: /projects
Disallow: /auth
Disallow: /api

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

  res.type('text/plain');
  res.send(robotsTxt);
});

module.exports = router;

