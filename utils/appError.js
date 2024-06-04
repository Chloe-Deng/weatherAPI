class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // this.isOperational = true;

    // The Error.captureStackTrace method is used to create a .stack property on the object that contains information about the call stack. This is useful for debugging and error tracing as it provides detailed information about where the error occurred.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
