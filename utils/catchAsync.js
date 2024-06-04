// catchAsync returns a new middleware function.
// This middleware function executes the incoming asynchronous function fn(req, res, next) when it is called.
// If an error occurs during the execution of the asynchronous function, the error is caught and passed to Express' error handling middleware via next(err).
// By using catchAsync, we can ensure that errors in all asynchronous route handlers are caught and handled uniformly without having to rewrite the try-catch logic in each asynchronous function.

/**
 *
 * @param {function} fn - an async function, which will return a promise, then we can use catch to catch the err, and this err will then pass into the global error object
 *
 * @returns a middleware function, when this middleware function got called, it will execute the async function which is the param function, and then catch the error.
 */
module.exports = (fn) => {
  // returns a new middleware function.
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
