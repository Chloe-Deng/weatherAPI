const Weather = require('./../models/weatherModel');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');

/**
 * GET /weather
 *
 * Get a list of weather data
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express request object
 */
exports.getAllWeather = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Weather.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const weather = await features.query;

    // Return a promise
    // const weather = await Weather.find();

    res.status(200).json({
      status: 'success',
      results: weather.length,
      data: {
        weather,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Failed to get the weather data',
    });
  }
};

/**
 * GET /weather/id
 *
 * Get a single weather data by ID
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express request object
 */
exports.getWeather = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const weather = await Weather.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        weather,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: `No matched ID with that weather data. Invalid ${err.path}: ${err.value}`,
    });
  }
};

/**
 * POST /weather
 *
 * Insert a new weather reading
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express request object
 */
exports.createWeather = async (req, res) => {
  try {
    const newWeather = await Weather.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        weather: newWeather,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Could not create a new reading. Please provide valid data.',
    });
  }
};

/**
 * POST /weather
 *
 * Insert many weather data
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.createManyWeather = async (req, res) => {
  try {
    const weatherData = req.body;
    const newWeather = await Weather.insertMany(weatherData);

    res.status(201).json({
      status: 'success',
      records: weatherData.length,
      data: {
        weather: newWeather,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

/**
 * PATCH /weather/id
 *
 * Update a specific weather record by its id
 *
 * This function updates the weather record in the database based on the provided id. It expects the id of the record to be updated to be provided in the URL parameters (req.params.id), and the updated data to be provided in the request body (req.body).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.updateWeather = async (req, res) => {
  try {
    const weather = await Weather.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        weather,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Failed to update, No weather found with that ID',
    });
  }
};

exports.updatePrecipitation = async (req, res) => {
  try {
    if (req.body.precipitation === undefined) {
      return res.status(400).json({
        status: 'fail',
        message: 'No precipitation value provided for update',
      });
    }

    const weather = await Weather.findByIdAndUpdate(
      req.params.id,
      { precipitation: req.body.precipitation },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!weather) {
      return res.status(404).json({
        status: 'fail',
        message: 'No weather found with that ID',
      });
    }

    res.status(200).json({
      status: 'Success',
      data: {
        weather,
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error: ' + messages.join('. '),
      });
    }
    res.status(500).json({
      status: 'fail',
      message: 'An error occurred: ' + err.message,
    });
  }
};

/**
 * DELETE /weather/id
 *
 * Delete a single weather data by its ID
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 */
exports.deleteWeather = async (req, res) => {
  try {
    const doc = await Weather.findOneAndDelete({ _id: req.params.id });

    if (doc) {
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'No document found with that ID',
      });
    }
  } catch (err) {
    // 捕获并处理任何可能的错误
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// exports.deleteWeather = async (req, res) => {
//   try {
//     // Do not send back any data to the client when there was a delete operation
//     await Weather.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: 'success',
//       message: `Deleted ${req.params.id} reading.`,
//       data: null,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'Failed to delete the data, please provide valid data ID',
//     });
//   }
// };

/**
 *
 * GET /max-Precipitation
 *
 * Get maximum precipitation for a specific sensor in the last 5 months
 *
 * @param {request} req
 * @param {response} res
 */

exports.getMaxPrecipitation = async (req, res) => {
  const { sensorName } = req.params;
  const currentDate = new Date();
  const fiveMonthsAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 5,
    currentDate.getDate()
  );

  try {
    const maxPrecipitationReading = await Weather.aggregate([
      // Filter for data from the specific sensor within the last five months
      {
        $match: {
          deviceName: sensorName,
          time: { $gte: fiveMonthsAgo, $lte: currentDate },
        },
      },
      // Sort by precipitation in descending order
      {
        $sort: { precipitation: -1 },
      },
      // Limit the results to only one record
      {
        $limit: 1,
      },
      // Select the fields to be displayed
      {
        $project: {
          _id: 0, // Do not display the _id field
          deviceName: 1, // Display the device name
          time: 1, // Display the time
          precipitation: 1, // Display the precipitation amount
        },
      },
    ]);

    if (maxPrecipitationReading.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message:
          'No precipitation record found for the specified sensor in the last five months',
      });
    }

    res.status(200).json({
      status: 'success',
      data: maxPrecipitationReading[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error occurred while querying for maximum precipitation',
    });
  }
};

/**
 *
 * GET /max-temp/year
 *
 * Find the Max Temperature within the past  year, and return the sensor name,
 * reading date, and the max temperature
 *
 * @param {Object} req - An object containing request information.
 * @param {Object} res - The response object used to return the processing result.
 *
 * @returns {Promise} - Returns a Promise object representing the function's execution result.
 * @throws {Error} - Throws an exception if an error occurs.
 */

exports.getMaxTemp = async (req, res) => {
  const { startDate, endDate } = req.query; // Assume these are provided as query parameters in ISO format

  // Convert query parameters to dates
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);

  try {
    const maxTemperatureReading = await Weather.aggregate([
      // Match documents within the specified date range
      {
        $match: {
          time: { $gte: startDateTime, $lte: endDateTime },
        },
      },
      // Sort by temperature in descending order to get the highest temperature first
      {
        $sort: { temperature: -1 },
      },
      // Group by sensor name to get the maximum temperature per sensor
      {
        $group: {
          _id: '$deviceName', // Group by device name
          maxTemperature: { $first: '$temperature' }, // The first document after sorting will have the max temp
          time: { $first: '$time' }, // Get the corresponding time of the max temperature
        },
      },
      // Project the results to format them as required
      {
        $project: {
          _id: 0,
          sensorName: '$_id',
          time: 1,
          temperature: '$maxTemperature',
        },
      },
      // Optionally sort by sensor name if needed
      {
        $sort: { sensorName: 1 },
      },
    ]);

    // Check if we found any readings
    if (maxTemperatureReading.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No temperature readings found for the specified date range',
      });
    }

    res.status(200).json({
      status: 'success',
      data: maxTemperatureReading,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error occurred while querying for maximum temperature',
    });
  }
};

// exports.getMaxTemp = async (req, res) => {
//   try {
//     const year = req.params.year * 1;
//     const stats = await Weather.aggregate([
//       // Match documents for 1 year
//       {
//         $match: {
//           time: {
//             $gte: new Date(`${year}-01-01`),
//             $lte: new Date(`${year}-12-31`),
//           },
//         },
//       },
//       // Group documents by sensor and find max precipitation
//       {
//         $group: {
//           _id: '$deviceName',
//           maxTemp: { $max: '$temperature' },
//           readingDate: { $last: '$time' },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           deviceName: '$_id',
//           readingDate: 1,
//           maxTemp: 1,
//         },
//       },

//       // { $sort: { maxPrecipitation: 1 } },
//     ]);
//     res.status(200).json({
//       status: 'Success',
//       data: {
//         stats,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'Failed to get the data. Please try again',
//     });
//   }
// };

exports.getWeatherStats = async (req, res) => {
  const { sensorName } = req.params;
  const { date, time } = req.query;

  const dateTimeISO = `${date}T${time}Z`;
  const dateTime = new Date(dateTimeISO);

  try {
    const weatherReading = await Weather.findOne({
      deviceName: sensorName,
      // 使用 ISODate 进行查询
      time: {
        $gte: new Date(dateTime.toISOString()),
        $lt: new Date(new Date(dateTime).getTime() + 1000),
      },
    }).select(
      'temperature atmosphericPressure solarRadiation precipitation -_id'
    );

    if (!weatherReading) {
      return res.status(404).json({
        status: 'fail',
        message: 'No reading found for the specified date and time',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        weatherReading,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
