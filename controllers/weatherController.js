const mongoose = require('mongoose');
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

    if (weather.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Weather data not found.',
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: 'success',
      results: weather.length,
      data: {
        weather,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: 'Failed to get the weather data.',
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid ID format.',
      });
    }

    const weather = await Weather.findById(id);

    if (!weather) {
      return res.status(404).json({
        status: 404,
        message: 'No matched ID with that weather data. ',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        weather,
      },
    });
  } catch (err) {
    console.error('Error processing request:', err.message);
    res.status(500).json({
      status: 500,
      message: 'Error processing request.',
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
      statusCode: 201,
      status: 'success',
      message: 'Weather data successfully created',
      data: newWeather,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        status: 400,
        message: 'Validation error: ' + messages.join('. '),
      });
    }
    res.status(500).json({
      status: 500,
      message: 'An error occurred when creating a new weather reading!',
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
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        status: 400,
        message: 'Validation error: ' + messages.join('. '),
      });
    }
    res.status(500).json({
      status: 500,
      message: 'Unable to precess request due to server error.',
    });
  }
};

/**
 * PATCH /weather/id
 *
 * Update a specific weather record by its id
 *
 * This function updates the weather record in the database based on the provided id. It expects the id of the
 *  record to be updated to be provided in the URL parameters (req.params.id), and the updated data to be provided in the request body (req.body).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.updateWeather = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid ID format.',
      });
    }

    const weather = await Weather.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!weather) {
      return res.status(404).json({
        status: 404,
        message: 'Fail to update, no weather found with that ID.',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Weather data updated successfully',
      data: weather,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        status: 400,
        message: 'Validation error: ' + messages.join('. '),
      });
    }
    res.status(500).json({
      status: 500,
      message: 'Error processing request.',
    });
  }
};

exports.updatePrecipitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { precipitation } = req.body;

    if (precipitation === undefined) {
      return res.status(400).json({
        status: 400,
        message: 'No precipitation value provided for update',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid ID format',
      });
    }

    const weather = await Weather.findByIdAndUpdate(
      id,
      { precipitation: precipitation },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!weather) {
      return res.status(404).json({
        status: 404,
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
        status: 400,
        message: 'Validation error: ' + messages.join('. '),
      });
    }
    res.status(500).json({
      status: 500,
      message: 'An error occurred when updating the precipitation.',
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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid ID format',
      });
    }

    const doc = await Weather.findOneAndDelete({ _id: id });

    console.log('Result of findOneAndDelete:', doc);

    if (!doc) {
      return res.status(404).json({
        status: 404,
        message: 'Fail to delete, no document found with that ID',
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Document deleted successfully.',
      data: null,
    });
  } catch (err) {
    if (err.message === 'No document found with that ID') {
      return res.status(404).json({
        status: 404,
        message: 'No document found with that ID',
      });
    }

    res.status(500).json({
      status: 500,
      message: 'Error processing request: ' + err.message,
    });
  }
};

/**
 *
 * GET /max-Precipitation/:sensorName
 *
 * Get maximum precipitation for a specific sensor in the last 5 months
 *
 * @param {request} req
 * @param {response} res
 */

exports.getMaxPrecipitation = async (req, res) => {
  try {
    const { sensorName } = req.params;

    // Verify that the sensorName contains only letters (both upper and lower case), numbers, and underscores
    if (!/^[a-zA-Z_]+$/.test(sensorName)) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid sensor name format',
      });
    }

    const currentDate = new Date();
    const fiveMonthsAgo = new Date(
      currentDate.getFullYear(), // get year from current date
      currentDate.getMonth() - 5, // 0 based, get the current month and subtracts 5 to get the month five months ago
      currentDate.getDate() // get current date
    );

    const maxPrecipitation = await Weather.aggregate([
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

    if (maxPrecipitation.length === 0) {
      return res.status(404).json({
        status: 404,
        message:
          'No precipitation record found for the specified sensor in the last five months',
      });
    }

    res.status(200).json({
      status: 'success',
      data: maxPrecipitation[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: 'Error occurred while querying for maximum precipitation.',
    });
  }
};

/**
 *
 * GET /max-temp/year
 *
 * Find the Max Temperature within the past year, and return the sensor name, reading date, and the max temperature
 *
 * @param {Object} req - An object containing request information.
 * @param {Object} res - The response object used to return the processing result.
 *
 * @returns {Promise} - Returns a Promise object representing the function's execution result.
 *
 */

exports.getMaxTemp = async (req, res) => {
  const { startDate, endDate } = req.query;

  // YYYY-MM-DD
  const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr); //boolean
  };

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid date format for startDate or endDate.',
    });
  }

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
      // Project the results and format them as required
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

    if (maxTemperatureReading.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No temperature readings found for the specified date range.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: maxTemperatureReading,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: 'Error occurred while querying for maximum temperature.',
    });
  }
};

exports.getWeatherStats = async (req, res) => {
  const { sensorName } = req.params;
  const { date, time } = req.query;

  if (!sensorName) {
    return res.status(400).json({
      status: 400,
      message: 'Sensor name is required.',
    });
  }

  if (!date || !time) {
    return res.status(400).json({
      status: 400,
      message: 'Date and time are required.',
    });
  }

  const dateTimeISO = `${date}T${time}Z`; // Convert date and time to ISO string
  const dateTime = new Date(dateTimeISO); // Convert ISO string to date object

  // Handle invalid date format
  if (isNaN(dateTime.getTime())) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid date or time format.',
    });
  }

  try {
    const weatherReading = await Weather.findOne({
      deviceName: sensorName,
      time: {
        $gte: new Date(dateTime.toISOString()),
        $lt: new Date(new Date(dateTime).getTime() + 1000),
      },
    }).select(
      'temperature atmosphericPressure solarRadiation precipitation -_id'
    );

    if (!weatherReading) {
      return res.status(404).json({
        status: 404,
        message: 'No reading found for the specified date and time.',
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
      status: 500,
      message: `Error processing request: ${err.message}`,
    });
  }
};
