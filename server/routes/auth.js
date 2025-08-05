const express = require('express');
const bcrypt = require('bcryptjs');
const Exhibitor = require('../models/Exhibitor');

const router = express.Router();

// Mock exhibitor data for demo
const mockExhibitors = [
  {
    email: 'demo@company.com',
    password: 'password123',
    companyName: 'Demo Company',
    contactName: 'John Doe',
    phone: '555-0123',
    website: 'https://democompany.com',
    boothNumber: 'A12',
    paymentStatus: 'Paid in Full'
  },
  {
    email: 'admin@expo.com',
    password: 'admin123',
    companyName: 'Admin User',
    contactName: 'Admin User',
    phone: '555-0000',
    website: 'https://expo.com',
    boothNumber: 'Admin',
    paymentStatus: 'Paid in Full'
  }
];

// Initialize mock data
router.post('/init', async (req, res) => {
  try {
    for (const mockExhibitor of mockExhibitors) {
      const existingExhibitor = await Exhibitor.findOne({ email: mockExhibitor.email });
      if (!existingExhibitor) {
        const hashedPassword = await bcrypt.hash(mockExhibitor.password, 10);
        await Exhibitor.create({
          ...mockExhibitor,
          password: hashedPassword
        });
      }
    }
    res.json({ message: 'Mock data initialized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const exhibitor = await Exhibitor.findOne({ email });
    if (!exhibitor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, exhibitor.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store user info in session
    req.session.userId = exhibitor._id;
    req.session.userEmail = exhibitor.email;
    req.session.userRole = exhibitor.email === 'admin@expo.com' ? 'admin' : 'exhibitor';

    res.json({
      message: 'Login successful',
      user: {
        id: exhibitor._id,
        email: exhibitor.email,
        companyName: exhibitor.companyName,
        contactName: exhibitor.contactName,
        role: req.session.userRole
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Check session
router.get('/session', (req, res) => {
  if (req.session.userId) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        email: req.session.userEmail,
        role: req.session.userRole
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

module.exports = router; 