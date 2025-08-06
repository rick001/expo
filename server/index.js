const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const exhibitorRoutes = require('./routes/exhibitors');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to handle malformed URLs and URI decoding errors
app.use((req, res, next) => {
  try {
    // Check if the URL contains malformed encoding patterns (common attack vectors)
    const malformedPatterns = ['%C0', '%C1', '%C2', '%C3', '%C4', '%C5', '%C6', '%C7', '%C8', '%C9', '%CA', '%CB', '%CC', '%CD', '%CE', '%CF'];
    const hasMalformedEncoding = malformedPatterns.some(pattern => req.url.includes(pattern));
    
    if (hasMalformedEncoding) {
      console.log(`Malformed URL detected and blocked: ${req.url}`);
      return res.status(400).json({ error: 'Invalid URL encoding' });
    }
    
    // Try to decode the URL to catch any URI decoding errors
    decodeURIComponent(req.url);
    next();
  } catch (error) {
    console.log(`URI decoding error for URL: ${req.url}`);
    return res.status(400).json({ error: 'Invalid URL encoding' });
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://expo.techlab.live', 'http://expo.techlab.live'] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'smart-exhibitor-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-exhibitor-portal',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production' && process.env.HTTPS === 'true',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-exhibitor-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exhibitors', exhibitorRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing, return all requests to React app
// This should be the last route to catch all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Handle URI decoding errors specifically
  if (err instanceof URIError || err.message.includes('Failed to decode param')) {
    console.log(`URI decoding error handled: ${req.url}`);
    return res.status(400).json({ error: 'Invalid URL encoding' });
  }
  
  // Handle other errors
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  if (err instanceof URIError || err.message.includes('Failed to decode param')) {
    console.log('URI decoding error caught globally:', err.message);
    return;
  }
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  if (reason instanceof URIError || (reason && reason.message && reason.message.includes('Failed to decode param'))) {
    console.log('URI decoding error caught in unhandled rejection:', reason.message);
    return;
  }
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 