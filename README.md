# Smart Exhibitor Portal

A fullstack web application for self-service onboarding of trade show exhibitors, similar to Small Business Expo. This MVP demonstrates a complete exhibitor management system with both exhibitor and admin interfaces.

## 🚀 Features

### Exhibitor Features
- **Dashboard**: Overview with onboarding progress and booth information
- **Logo Upload**: Drag-and-drop logo upload with admin approval workflow
- **Company Information**: Submit company details, products, and target audience
- **Webinar Scheduling**: Date picker for promotional webinars (requires full payment)
- **Marketing Banner Generation**: Auto-generate promotional banners using uploaded logos
- **Booth Upgrade**: Request larger booth sizes with pricing
- **AI Chatbot**: Interactive FAQ assistant with hardcoded responses

### Admin Features
- **Dashboard Overview**: Statistics and recent activity
- **Exhibitor Management**: View all exhibitors in a table format
- **Approval Workflows**: Approve/reject logos and company information
- **Payment Management**: Update payment status for exhibitors
- **Detailed Views**: Modal popups for exhibitor details

## 🛠 Tech Stack

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer for logo uploads
- **Authentication**: Session-based with bcrypt
- **Icons**: Lucide React
- **Development**: Concurrently for fullstack development

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/smart-exhibitor-portal
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

### 3. Initialize Mock Data

The application includes mock data for demonstration. Run this once to set up demo accounts:

```bash
# Start the server first
npm run server

# In another terminal, make a POST request to initialize data
curl -X POST http://localhost:3001/api/auth/init
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend React app on `http://localhost:3000`

## 👤 Demo Credentials

### Exhibitor Account
- **Email**: `demo@company.com`
- **Password**: `password123`

### Admin Account
- **Email**: `admin@expo.com`
- **Password**: `admin123`

## 📁 Project Structure

```
smartExhibitorPortal/
├── server/
│   ├── index.js              # Main server file
│   ├── models/
│   │   └── Exhibitor.js      # MongoDB schema
│   └── routes/
│       ├── auth.js           # Authentication routes
│       ├── exhibitors.js     # Exhibitor API routes
│       └── admin.js          # Admin API routes
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── App.js           # Main app component
│   │   └── index.js         # React entry point
│   └── package.json
├── uploads/                  # File upload directory
├── package.json
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start both frontend and backend
npm run server       # Start backend only
npm run client       # Start frontend only

# Production
npm run build        # Build React app
npm run install-all  # Install all dependencies
```

## 🎯 Core Functionality

### Exhibitor Onboarding Flow
1. **Login** with demo credentials
2. **Upload Logo** - Drag and drop company logo
3. **Submit Company Info** - Company description, products, target audience
4. **Schedule Webinar** - Select date (requires "Paid in Full" status)
5. **Generate Marketing Banner** - Create promotional banner
6. **Request Booth Upgrade** - Request larger booth size

### Admin Workflow
1. **Login** with admin credentials
2. **Review Submissions** - View pending logos and company info
3. **Approve/Reject** - Manage exhibitor submissions
4. **Update Payment Status** - Change exhibitor payment status
5. **Monitor Progress** - View dashboard statistics

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Interface**: Clean, professional design with smooth animations
- **Interactive Elements**: Hover effects, loading states, and transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Real-time Updates**: Dynamic content updates without page refresh

## 🔒 Security Features

- **Session Management**: Secure session handling with MongoDB store
- **Password Hashing**: bcrypt for password security
- **File Upload Validation**: Type and size restrictions for uploads
- **Authentication Middleware**: Protected routes for exhibitor and admin areas
- **CORS Configuration**: Proper cross-origin request handling

## 🚀 Deployment Considerations

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret key for session encryption
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)

### Production Build
```bash
# Build the React app
npm run build

# The server will serve static files in production
NODE_ENV=production npm start
```

## 🧪 Testing the Application

1. **Start the application** with `npm run dev`
2. **Login as exhibitor** with demo credentials
3. **Complete onboarding checklist**:
   - Upload a logo (any image file)
   - Submit company information
   - Try to schedule webinar (will be blocked until payment is "Paid in Full")
   - Generate marketing banner
   - Request booth upgrade
4. **Login as admin** to approve submissions
5. **Test the chatbot** by clicking the message icon

## 🔮 Future Enhancements

- **Real Email Integration**: Send confirmation emails and notifications
- **Advanced Banner Generation**: AI-powered banner customization
- **Payment Integration**: Stripe/PayPal payment processing
- **Real-time Notifications**: WebSocket for live updates
- **Advanced Analytics**: Detailed reporting and insights
- **Multi-event Support**: Support for multiple trade shows
- **Mobile App**: React Native companion app

## 🤝 Contributing

This is a demonstration project showcasing fullstack development capabilities. The code is structured for easy understanding and extension.

## 📄 License

MIT License - feel free to use this code for learning and development purposes.

---

**Smart Exhibitor Portal** - Empowering trade show exhibitors with self-service onboarding automation. 