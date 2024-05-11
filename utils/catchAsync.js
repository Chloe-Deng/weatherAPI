// In order to remove try catch block, we wrap the async function into catchAsync function, and then assign it to createTour,
// inside the catchAsync, return an anonymous function, which will be called when a new tour is created using the createTour handler
// it's this returned function calls the async function
// fn is an async function, which will return a promise, then we can use catch to catch the err, and this err will then pass into the global error handler

/**
 *
 * @param {function} fn - an async function, which will return a promise, then we can use catch to catch the err, and this err will then pass into the global error object
 *
 * @returns an anonymous function, which will be called when a new tour is created using the createTour handler
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
