const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    // error: err,
    message: err.message,
    // stack: err.stack,
  });
};

// Global error handler
module.exports = (err, req, res, next) => {
  // console.log(err.stack)
  // 500: internal server error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
};
