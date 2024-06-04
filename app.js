const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const docs = require('./utils/swagger');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const weatherRouter = require('./routes/weatherRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(cookieParser());

// 1）GLOBAL MIDDLEWARE
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit 200 requests from the same IP in one hour
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});
app.use('/api', limiter);

// Implement CORS
const corsOptions = {
  origin: ['https://www.google.com', 'https://www.wikipedia.org'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// app.use(cors());
// app.options('*', cors());
// app.options('/api/v1/weather/:1d', cors())

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));

// Use Swagger to generate API specification
app.use(docs);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/weather', weatherRouter);
app.use('/api/v1/users', userRouter);

// The catch-all route handler that matches all HTTP methods and paths not handled by previous routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
