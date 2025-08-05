const express = require('express');
const Exhibitor = require('../models/Exhibitor');

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all exhibitors for admin dashboard
router.get('/exhibitors', requireAdmin, async (req, res) => {
  try {
    const exhibitors = await Exhibitor.find({ email: { $ne: 'admin@expo.com' } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ exhibitors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific exhibitor details
router.get('/exhibitors/:id', requireAdmin, async (req, res) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id).select('-password');
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    res.json({ exhibitor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/reject logo
router.put('/exhibitors/:id/logo', requireAdmin, async (req, res) => {
  try {
    const { approved } = req.body;
    
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    exhibitor.logo.approved = approved;
    
    // Auto-regenerate marketing banner when logo is approved
    if (approved && exhibitor.logo.filename) {
      const bannerPath = `uploads/banners/banner-${exhibitor._id}-${Date.now()}.png`;
      
      // Import the banner generation function
      const { generateBannerWithLogo } = require('../utils/bannerGenerator');
      
      // Actually generate the banner image with the logo
      const bannerGenerated = await generateBannerWithLogo(exhibitor, bannerPath);
      
      if (bannerGenerated) {
        exhibitor.marketingBanner = {
          generated: true,
          imagePath: bannerPath,
          eventName: exhibitor.marketingBanner?.eventName || 'Small Business Expo 2024'
        };
        exhibitor.onboardingChecklist.marketingBannerGenerated = true;
      }
    }
    
    await exhibitor.save();

    res.json({
      message: `Logo ${approved ? 'approved' : 'rejected'} successfully`,
      logo: exhibitor.logo,
      marketingBanner: exhibitor.marketingBanner
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/reject company info
router.put('/exhibitors/:id/company-info', requireAdmin, async (req, res) => {
  try {
    const { approved } = req.body;
    
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    exhibitor.companyInfo.approved = approved;
    await exhibitor.save();

    res.json({
      message: `Company info ${approved ? 'approved' : 'rejected'} successfully`,
      companyInfo: exhibitor.companyInfo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/reject booth upgrade
router.put('/exhibitors/:id/booth-upgrade', requireAdmin, async (req, res) => {
  try {
    const { approved } = req.body;
    
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    exhibitor.boothUpgrade.approved = approved;
    if (approved) {
      exhibitor.boothSize = exhibitor.boothUpgrade.requestedSize;
    }
    await exhibitor.save();

    res.json({
      message: `Booth upgrade ${approved ? 'approved' : 'rejected'} successfully`,
      boothUpgrade: exhibitor.boothUpgrade,
      boothSize: exhibitor.boothSize
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark checklist item complete
router.put('/exhibitors/:id/checklist', requireAdmin, async (req, res) => {
  try {
    const { item, completed } = req.body;
    
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    if (exhibitor.onboardingChecklist.hasOwnProperty(item)) {
      exhibitor.onboardingChecklist[item] = completed;
      await exhibitor.save();
    }

    res.json({
      message: `Checklist item ${item} ${completed ? 'marked complete' : 'marked incomplete'}`,
      onboardingChecklist: exhibitor.onboardingChecklist
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment status
router.put('/exhibitors/:id/payment', requireAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) {
      return res.status(404).json({ error: 'Exhibitor not found' });
    }

    exhibitor.paymentStatus = paymentStatus;
    await exhibitor.save();

    res.json({
      message: 'Payment status updated successfully',
      paymentStatus: exhibitor.paymentStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admin dashboard stats
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const totalExhibitors = await Exhibitor.countDocuments({ email: { $ne: 'admin@expo.com' } });
    const pendingLogos = await Exhibitor.countDocuments({
      'logo.filename': { $exists: true },
      'logo.approved': false
    });
    const pendingCompanyInfo = await Exhibitor.countDocuments({
      'companyInfo.description': { $exists: true },
      'companyInfo.approved': false
    });
    const pendingBoothUpgrades = await Exhibitor.countDocuments({
      'boothUpgrade.requested': true,
      'boothUpgrade.approved': false
    });
    const paidInFull = await Exhibitor.countDocuments({
      paymentStatus: 'Paid in Full'
    });

    res.json({
      stats: {
        totalExhibitors,
        pendingLogos,
        pendingCompanyInfo,
        pendingBoothUpgrades,
        paidInFull
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new exhibitor
router.post('/exhibitors', requireAdmin, async (req, res) => {
  try {
    const { 
      email, 
      password, 
      companyName, 
      contactName, 
      phone, 
      website,
      boothNumber,
      boothSize = '10x10',
      paymentStatus = 'Pending'
    } = req.body;

    // Check if exhibitor already exists
    const existingExhibitor = await Exhibitor.findOne({ email });
    if (existingExhibitor) {
      return res.status(400).json({ error: 'Exhibitor with this email already exists' });
    }

    // Create new exhibitor
    const exhibitor = new Exhibitor({
      email,
      password, // Will be hashed by the model
      companyName,
      contactName,
      phone,
      website,
      boothNumber,
      boothSize,
      paymentStatus,
      onboardingChecklist: {
        logoUploaded: false,
        companyInfoSubmitted: false,
        webinarDateSelected: false,
        boothUpgradeRequested: false,
        marketingBannerGenerated: false
      }
    });

    await exhibitor.save();

    res.status(201).json({
      message: 'Exhibitor created successfully',
      exhibitor: {
        id: exhibitor._id,
        email: exhibitor.email,
        companyName: exhibitor.companyName,
        contactName: exhibitor.contactName,
        phone: exhibitor.phone,
        website: exhibitor.website,
        boothNumber: exhibitor.boothNumber,
        boothSize: exhibitor.boothSize,
        paymentStatus: exhibitor.paymentStatus
      }
    });
  } catch (error) {
    console.error('Error creating exhibitor:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reset database for demo purposes
router.post('/reset-demo', requireAdmin, async (req, res) => {
  try {
    // Delete all exhibitors except admin
    await Exhibitor.deleteMany({ email: { $ne: 'admin@expo.com' } });
    
    // Clear uploaded files (logos and banners)
    const fs = require('fs');
    const path = require('path');
    
    // Clear logos directory
    const logosDir = path.join(__dirname, '..', 'uploads', 'logos');
    if (fs.existsSync(logosDir)) {
      const logoFiles = fs.readdirSync(logosDir);
      logoFiles.forEach(file => {
        if (file !== 'test-logo.svg') { // Keep test logo
          fs.unlinkSync(path.join(logosDir, file));
        }
      });
    }
    
    // Clear banners directory
    const bannersDir = path.join(__dirname, '..', 'uploads', 'banners');
    if (fs.existsSync(bannersDir)) {
      const bannerFiles = fs.readdirSync(bannersDir);
      bannerFiles.forEach(file => {
        fs.unlinkSync(path.join(bannersDir, file));
      });
    }
    
    res.json({
      message: 'Database reset successfully for demo. All exhibitors, logos, and banners have been cleared.',
      reset: true
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 