require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./utils/logger');

// Enable CORS before Security Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false })); // Secure HTTP headers
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } })); // HTTP Logging

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 requests per window
  message: { msg: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shirdisai')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/faceAuth', require('./routes/faceAuth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/behavior', require('./routes/behavior'));
app.use('/api/mocktests', require('./routes/mocktests'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/intelligence', require('./routes/intelligence'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/exam', require('./routes/exam'));
app.use('/api/examAdmin', require('./routes/examAdmin'));
app.use('/api/admissions', require('./routes/admissions'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/companion', require('./routes/companion'));
app.use('/api/teacher-feedback', require('./routes/teacherFeedback'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
