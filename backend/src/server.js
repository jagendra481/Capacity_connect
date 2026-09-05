const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const database = require('./config/database');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const skillRoutes = require('./routes/skillRoutes');
const competencyRoutes = require('./routes/competencyRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const knowledgeRoutes = require('./routes/knowledgeRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const capacityRadarRoutes = require('./routes/capacityRadarRoutes');

const app = express();

// Global Middlewares
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    name: 'CAPACITY CONNECT API',
    timestamp: new Date().toISOString(),
    database: database.getIsPgConnected() ? 'PostgreSQL' : 'MemoryDatastore (Resilient)',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/competency', competencyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/capacity-radar', capacityRadarRoutes);

// Serve static frontend build in production / deployment
const path = require('path');
const fs = require('fs');
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await database.connectDb();
  app.listen(env.port, () => {
    logger.info(`🚀 Capacity Connect Server running on port ${env.port} [${env.nodeEnv}]`);
  });
};

module.exports = app;
module.exports.startServer = startServer;

