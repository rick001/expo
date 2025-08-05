const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Exhibitor = require('../models/Exhibitor');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/logos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get exhibitor dashboard data
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const exhibitor = await Exhibitor.findById(req.session.userId);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    res.json({
      exhibitor: {
        id: exhibitor._id,
        email: exhibitor.email,
        companyName: exhibitor.companyName,
        contactName: exhibitor.contactName,
        phone: exhibitor.phone,
        website: exhibitor.website,
        boothNumber: exhibitor.boothNumber,
        boothSize: exhibitor.boothSize,
        paymentStatus: exhibitor.paymentStatus,
        onboardingChecklist: exhibitor.onboardingChecklist,
        logo: exhibitor.logo,
        companyInfo: exhibitor.companyInfo,
        webinarDate: exhibitor.webinarDate,
        boothUpgrade: exhibitor.boothUpgrade,
        marketingBanner: exhibitor.marketingBanner
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload logo
router.post('/upload-logo', requireAuth, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const exhibitor = await Exhibitor.findById(req.session.userId);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    exhibitor.logo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      approved: false
    };
    exhibitor.onboardingChecklist.logoUploaded = true;
    await exhibitor.save();

    res.json({
      message: 'Logo uploaded successfully',
      logo: exhibitor.logo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit company info
router.post('/company-info', requireAuth, async (req, res) => {
  try {
    const { description, products, targetAudience } = req.body;
    
    const exhibitor = await Exhibitor.findById(req.session.userId);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    exhibitor.companyInfo = {
      description,
      products: Array.isArray(products) ? products : [products],
      targetAudience,
      approved: false
    };
    exhibitor.onboardingChecklist.companyInfoSubmitted = true;
    await exhibitor.save();

    res.json({
      message: 'Company information submitted successfully',
      companyInfo: exhibitor.companyInfo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Select webinar date
router.post('/webinar-date', requireAuth, async (req, res) => {
  try {
    const { webinarDate } = req.body;
    
    const exhibitor = await Exhibitor.findById(req.session.userId);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    if (exhibitor.paymentStatus !== 'Paid in Full') {
      return res.status(403).json({ error: 'Webinar booking requires full payment' });
    }

    exhibitor.webinarDate = new Date(webinarDate);
    exhibitor.onboardingChecklist.webinarDateSelected = true;
    await exhibitor.save();

    res.json({
      message: 'Webinar date selected successfully',
      webinarDate: exhibitor.webinarDate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request booth upgrade
router.post('/booth-upgrade', requireAuth, async (req, res) => {
  try {
    const { requestedSize } = req.body;
    
    const exhibitor = await Exhibitor.findById(req.session.userId);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    exhibitor.boothUpgrade = {
      requested: true,
      currentSize: exhibitor.boothSize,
      requestedSize,
      approved: false
    };
    await exhibitor.save();

    res.json({
      message: 'Booth upgrade requested successfully',
      boothUpgrade: exhibitor.boothUpgrade
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate marketing banner
router.post('/generate-banner', requireAuth, async (req, res) => {
  try {
    const exhibitor = await Exhibitor.findById(req.session.userId);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    if (!exhibitor.logo.filename) {
      return res.status(400).json({ error: 'Logo must be uploaded first' });
    }

    // Simulate banner generation
    const bannerPath = `uploads/banners/banner-${exhibitor._id}-${Date.now()}.png`;
    exhibitor.marketingBanner = {
      generated: true,
      imagePath: bannerPath,
      eventName: exhibitor.marketingBanner.eventName
    };
    exhibitor.onboardingChecklist.marketingBannerGenerated = true;
    await exhibitor.save();

    res.json({
      message: 'Marketing banner generated successfully',
      marketingBanner: exhibitor.marketingBanner
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available webinar dates
router.get('/webinar-dates', requireAuth, async (req, res) => {
  try {
    const exhibitor = await Exhibitor.findById(req.session.userId);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    if (exhibitor.paymentStatus !== 'Paid in Full') {
      return res.status(403).json({ error: 'Webinar booking requires full payment' });
    }

    // Mock available dates
    const availableDates = [
      '2024-03-15T10:00:00Z',
      '2024-03-16T14:00:00Z',
      '2024-03-17T11:00:00Z',
      '2024-03-18T15:00:00Z',
      '2024-03-19T09:00:00Z'
    ];

    res.json({ availableDates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 