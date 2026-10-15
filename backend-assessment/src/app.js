const express = require('express');

const tasksRouter = require('./modules/tasks/routes/tasks.routes');
const activityRouter = require('./modules/activity/routes/activity.routes');
const reportsRouter = require('./modules/reports/routes/reports.routes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const HttpError = require('./utils/httpError');
const { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS, MAX_REQUEST_SIZE } = require('./utils/constants');

const app = express();

app.use(express.json({ limit: MAX_REQUEST_SIZE }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(rateLimiter({ maxRequests: RATE_LIMIT_MAX_REQUESTS, windowMs: RATE_LIMIT_WINDOW_MS }));

app.use('/tasks', tasksRouter);
app.use('/activity', activityRouter);
app.use('/reports', reportsRouter);

app.use((req, res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
