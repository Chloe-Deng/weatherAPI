const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const docs = require('./utils/swagger');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const weatherRouter = require('./routes/weatherRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Implement CORS
// app.use(cors());
// Access-Control-Allow-Origin *
// app.use(
//   cors({
//     origin: 'https://www.test-cors.org/',
//   })
// );

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.options('*', cors());
// app.options('/api/v1/weather/:1d', cors())

app.use(express.json());
app.use(docs);

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
