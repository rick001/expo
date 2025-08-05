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
    await exhibitor.save();

    res.json({
      message: `Logo ${approved ? 'approved' : 'rejected'} successfully`,
      logo: exhibitor.logo
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

module.exports = router; 