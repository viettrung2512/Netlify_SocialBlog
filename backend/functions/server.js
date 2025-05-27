const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const connectDB = require('../config/db');
require('dotenv').config();

const app = express();

// Kết nối database
connectDB();

// Middleware
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://netlify-social.netlify.app/',
    'https://social-web-axbp.onrender.com',
    'https://accounts.google.com',
    'http://localhost:3000'
  ],
  exposedHeaders: ['Content-Type']
}));

// Security Headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://accounts.google.com",
      "connect-src 'self' http://localhost:8080 https://accounts.google.com",
      "style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com",
      "frame-src 'self' https://accounts.google.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: http://localhost:8080 https://res.cloudinary.com https://img.freepik.com"
    ].join('; ')
  );
  next();
});

// Import routes
const loginRouter = require('../routes/login');
const registerRouter = require('../routes/register');
const authRouter = require('../routes/auth');
const verifyRouter = require('../routes/verify');
const userRouter = require('../routes/user');
const uploadRouter = require('../routes/upload');
const postRouter = require('../routes/post');
const commentRouter = require('../routes/comment');
const notificationRouter = require('../routes/notification');
const likeRouter = require('../routes/like');
const followRouter = require('../routes/follow');
const bookmarkRouter = require('../routes/bookmark');
const audioRouter = require('../routes/audio');
const perspectiveRouter = require('../routes/perspective');
const adminRouter = require('../controllers/adminController');
const reportItemRouter = require('../routes/reportItem');
const historyRouter = require('../routes/history');

// API Routes
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/auth', authRouter);
app.use('/api/verify', verifyRouter);
app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/likes', likeRouter);
app.use('/api/follows', followRouter);
app.use('/api/bookmarks', bookmarkRouter);
app.use('/api/audio', audioRouter);
app.use('/api/perspective', perspectiveRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reports', reportItemRouter);
app.use('/api/history', historyRouter);

// Error Handlers
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Export handler for Netlify Functions
module.exports.handler = serverless(app);

// Local development
if (process.env.NETLIFY_DEV === 'true') {
  const PORT = process.env.PORT || 8888;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}