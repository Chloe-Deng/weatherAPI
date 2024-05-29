const express = require('express');
const weatherController = require('../controllers/weatherController');
const authController = require('../controllers/authController');

const router = express.Router();
/**
 * @openapi
 * /api/v1/weather/max-precipitation/{sensorName}:
 *   get:
 *     summary: Get the maximum precipitation recorded by a specific sensor in past five months
 *     tags: [Weather Readings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorName
 *         required: true
 *         description: The name of the sensor to retrieve the maximum precipitation for
 *         schema:
 *           type: string
 *           example: 'Woodford_Sensor'
 *     responses:
 *       200:
 *         description: Maximum precipitation data retrieved successfully for the given sensor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     deviceName:
 *                       type: string
 *                       example: "Woodford_Sensor"
 *                     time:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-07T02:14:09.000Z"
 *                     precipitation:
 *                       type: number
 *                       example: 0.085
 *       400:
 *         description: Bad request due to invalid sensor name or other query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid sensor name format."
 *       401:
 *         description: Unauthorized access, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "You are not logged in! Please log in to get access."
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       404:
 *         description: Sensor not found or no precipitation data available for the specified sensor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No precipitation record found for the specified sensor in the last five months."
 *       500:
 *         description: A server error occurred processing the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
router
  .route('/max-precipitation/:sensorName')
  .get(
    authController.protect,
    authController.restrictTo('teacher', 'student'),
    weatherController.getMaxPrecipitation
  );

/**
 * @openapi
 * /api/v1/weather/max-temp:
 *   get:
 *     summary: Retrieve the highest temperature records within a specified date range of all weather stations
 *     tags: [Weather Readings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         description: The start date for querying temperature data
 *         schema:
 *           type: string
 *           format: date
 *           example: '2020-01-01'
 *       - in: query
 *         name: endDate
 *         required: true
 *         description: The end date for querying temperature data
 *         schema:
 *           type: string
 *           format: date
 *           example: '2021-01-31'
 *     responses:
 *       200:
 *         description: An array of maximum temperature records within the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   minItems: 3
 *                   maxItems: 3
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                         format: date-time
 *                       sensorName:
 *                         type: string
 *                       temperature:
 *                         type: number
 *             examples:  # Examples for the whole response object
 *               example1:
 *                 value:
 *                   status: "success"
 *                   data: [
 *                     {
 *                       time: '2020-11-29T05:07:52.000Z',
 *                       sensorName: 'Noosa_Sensor',
 *                       temperature: 37.17
 *                     },
 *                     {
 *                       time: '2020-11-30T08:22:00.000Z',
 *                       sensorName: 'Woodford_Sensor',
 *                       temperature: 36.89
 *                     },
 *                     {
 *                       time: '2020-12-01T12:15:30.000Z',
 *                       sensorName: 'Yandina_Sensor',
 *                       temperature: 38.45
 *                     }
 *                   ]
 *
 *       400:
 *         description: Bad request due to invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid date format for startDate or endDate."
 *       401:
 *         description: Authorization information is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "You are not logged in! Please log in to get access."
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       404:
 *         description: No temperature records found for the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No temperature readings found for the specified date range."
 *       500:
 *         description: A server error occurred processing the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Error occurred while querying for maximum temperature."
 */
router
  .route('/max-temp')
  .get(
    authController.protect,
    authController.restrictTo('teacher', 'student'),
    weatherController.getMaxTemp
  );

/**
 * @openapi
 * /api/v1/weather/weather-stats/{sensorName}:
 *   get:
 *     summary: Get weather statistics by sensor name for a specific date
 *     tags: [Weather Readings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorName
 *         required: true
 *         description: The name of the weather sensor
 *         schema:
 *           type: string
 *           example: 'Yandina_Sensor'
 *       - in: query
 *         name: date
 *         required: true
 *         description: The date for which to retrieve the weather statistics
 *         schema:
 *           type: string
 *           format: date
 *           example: '2021-05-07'
 *       - in: query
 *         name: time
 *         required: true
 *         description: The time for which to retrieve the weather statistics
 *         schema:
 *           type: string
 *           format: time
 *           example: '00:44:04'
 *     responses:
 *       200:
 *         description: Weather statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     weatherReading:
 *                       type: object
 *                       properties:
 *                         atmosphericPressure:
 *                           type: number
 *                           example: 99.86
 *                         solarRadiation:
 *                           type: number
 *                           example: 447
 *                         temperature:
 *                           type: number
 *                           example: 20.5
 *                         precipitation:
 *                           type: number
 *                           example: 0.068
 *       400:
 *         description: Bad request due to invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid date or time format."
 *       401:
 *         description: Unauthorized access, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "You are not logged in! Please log in to get access."
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       404:
 *         description: Sensor name not found or no data for the given date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No reading found for the specified date and time."
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Error processing request"
 */
router
  .route('/weather-stats/:sensorName')
  .get(
    authController.protect,
    authController.restrictTo('teacher', 'student'),
    weatherController.getWeatherStats
  );

/**
 * @openapi
 * /api/v1/weather/update-precipitation/{id}:
 *   patch:
 *     summary: Update precipitation value for a specific weather entry
 *     tags: [Weather Readings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the weather entry
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               precipitation:
 *                 type: number
 *                 description: The new value for the precipitation
 *                 example: 0.066
 *     responses:
 *       200:
 *         description: Precipitation value updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     weather:
 *                       $ref: '#/components/schemas/WeatherData'
 *       400:
 *         description: Bad Request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Validation error: Precipitation cannot be negative."
 *       401:
 *         description: Unauthorized access, token missing or invalid login credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "You are not logged in! Please log in to get access."
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       404:
 *         description: Weather data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No weather found with that ID."
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An error occurred when updating the precipitation."
 */

router
  .route('/update-precipitation/:id')
  .patch(
    authController.protect,
    authController.restrictTo('teacher'),
    weatherController.updatePrecipitation
  );

/**
 * @openapi
 * /api/v1/weather:
 *   get:
 *     summary: Get all weather data (Teacher and student only)
 *     tags: [Weather Readings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Response object with weather data array
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 results:
 *                   type: integer
 *                   example: 2
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     weather:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WeatherData'
 *                       example:
 *                         - humidity: 70
 *                           latitude: 152.77891
 *                           atmosphericPressure: 128.08
 *                           deviceName: "Woodford_Sensor"
 *                           longitude: -26.95064
 *                           maxWindSpeed: 5.16
 *                           solarRadiation: 600.22
 *                           temperature: 23.4
 *                           time: "2022-05-07T02:14:09.000Z"
 *                           vaporPressure: 1.76
 *                           windDirection: 149.36
 *                           precipitation: 0.085
 *                         - humidity: 65
 *                           latitude: 152.77991
 *                           atmosphericPressure: 130.08
 *                           deviceName: "Everton_Sensor"
 *                           longitude: -26.95164
 *                           maxWindSpeed: 4.56
 *                           solarRadiation: 620.12
 *                           temperature: 24.1
 *                           time: "2022-05-07T03:14:09.000Z"
 *                           vaporPressure: 1.80
 *                           windDirection: 148.56
 *                           precipitation: 0.095
 *
 *       401:
 *         description: Unauthorized access, token missing or invalid login credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "You are not logged in! Please log in to get access."
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/404_BadRequest'
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               message: Failed to get the weather data.
 */

/**
 * @openapi
 * /api/v1/weather:
 *   post:
 *     summary: Insert a single new reading (Teacher and sensor only)
 *     tags: [Weather Readings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewWeatherData"
 *     responses:
 *       201:
 *         description: Weather data successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Weather data successfully created
 *                 weather:
 *                   $ref: "#/components/schemas/NewWeatherData"
 *       400:
 *         description: Bad request due to invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Validation error: Atmospheric pressure cannot be negative"
 *       401:
 *         description: Unauthorized access, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "You are not logged in! Please log in to get access."
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               message: "An error occurred when creating a new weather reading!"
 *
 *
 */

/**
 * @openapi
 * /api/v1/weather/batch:
 *   post:
 *     summary: Insert multiple weather readings (Teacher and Sensor only)
 *     tags: [Weather Readings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/NewWeatherData'
 *             example:
 *               - humidity: 70
 *                 latitude: 152.77891
 *                 atmosphericPressure: 128.08
 *                 deviceName: "Woodford_Sensor"
 *                 longitude: -26.95064
 *                 maxWindSpeed: 5.16
 *                 solarRadiation: 600.22
 *                 temperature: 23.4
 *                 time: "2022-05-07T02:14:09.000Z"
 *                 vaporPressure: 1.76
 *                 windDirection: 149.36
 *                 precipitation: 0.085
 *               - humidity: 65
 *                 latitude: 152.77991
 *                 atmosphericPressure: 130.08
 *                 deviceName: "Everton_Sensor"
 *                 longitude: -26.95164
 *                 maxWindSpeed: 4.56
 *                 solarRadiation: 620.12
 *                 temperature: 24.1
 *                 time: "2022-05-07T03:14:09.000Z"
 *                 vaporPressure: 1.80
 *                 windDirection: 148.56
 *                 precipitation: 0.095
 *     responses:
 *       201:
 *         description: Successfully added multiple weather readings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 records:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: object
 *                   properties:
 *                     weather:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WeatherData'
 *                       example:
 *                         - humidity: 70
 *                           latitude: 152.77891
 *                           atmosphericPressure: 128.08
 *                           deviceName: "Woodford_Sensor"
 *                           longitude: -26.95064
 *                           maxWindSpeed: 5.16
 *                           solarRadiation: 600.22
 *                           temperature: 23.4
 *                           time: "2022-05-07T02:14:09.000Z"
 *                           vaporPressure: 1.76
 *                           windDirection: 149.36
 *                           precipitation: 0.085
 *                         - humidity: 65
 *                           latitude: 152.77991
 *                           atmosphericPressure: 130.08
 *                           deviceName: "Everton_Sensor"
 *                           longitude: -26.95164
 *                           maxWindSpeed: 4.56
 *                           solarRadiation: 620.12
 *                           temperature: 24.1
 *                           time: "2022-05-07T03:14:09.000Z"
 *                           vaporPressure: 1.80
 *                           windDirection: 148.56
 *                           precipitation: 0.095
 *       400:
 *         description: Bad request due to invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Validation error: Atmospheric pressure cannot be negative"
 *       401:
 *         description: Unauthorized access, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "You are not logged in! Please log in to get access."
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Unable to process request due to server error
 */
router
  .route('/batch')
  .post(
    authController.protect,
    authController.restrictTo('teacher', 'sensor'),
    weatherController.createManyWeather
  );

/**
 * @openapi
 * /api/v1/weather/{id}:
 *   patch:
 *     summary: Update weather data by ID (Teacher only)
 *     tags: [Weather Readings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the weather data to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewWeatherData'
 *     responses:
 *       200:
 *         description: Weather data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Weather data updated successfully
 *                 weather:
 *                   $ref: '#/components/schemas/NewWeatherData'
 *
 *       404:
 *         description: Weather data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *             example:
 *               status: 404
 *               message: Fail to update, no weather data found with that ID.
 *       400:
 *         description: Bad request due to invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Validation error: Atmospheric pressure cannot be negative"
 *       401:
 *         description: Unauthorized access, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "You are not logged in! Please log in to get access."
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               message: Error processing request
 *
 *   delete:
 *     summary: Delete weather data by ID (Teacher only)
 *     tags: [Weather Readings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the weather data to delete
 *     responses:
 *       204:
 *         description: Weather data deleted successfully
 *       401:
 *         $ref: '#/components/responses/401_Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       404:
 *         description: Weather data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *             example:
 *               status: 404
 *               message: No document found with that ID
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *             example:
 *               status: 500
 *               message: Error processing request.
 */

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('teacher', 'student'),
    weatherController.getAllWeather
  )
  .post(
    authController.protect,
    authController.restrictTo('teacher', 'sensor'),
    weatherController.createWeather
  );

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('teacher'),
    weatherController.updateWeather
  )
  .delete(
    authController.protect,
    authController.restrictTo('teacher'),
    weatherController.deleteWeather
  );

module.exports = router;
