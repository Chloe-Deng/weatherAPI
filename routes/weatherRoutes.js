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
 *                   example: "Invalid sensor name or query parameters."
 *       401:
 *         description: Unauthorized access, token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "You are not logged in! Please log in to get access."
 *       404:
 *         description: Sensor not found or no precipitation data available for the specified sensor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "No precipitation record found for the specified sensor in the last five months."
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
 *     summary: Retrieve the highest temperature records within a specified date range
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
 *                   items:
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                         format: date-time
 *                         example: '2020-11-29T05:07:52.000Z'
 *                       sensorName:
 *                         type: string
 *                         example: 'Noosa_Sensor'
 *                       temperature:
 *                         type: number
 *                         example: 37.17
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
 *                   example: "An unexpected error occurred."
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
 *         name: date-time
 *         required: true
 *         description: The date for which to retrieve the weather statistics
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 'date=2021-05-07&time=00:44:04'
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
 *                   example: "Bad request due to invalid parameters"
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
 *                   example: "Sensor name not found or no data for the given date"
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
 *                   type: string
 *                   example: failure
 *                 message:
 *                   type: string
 *                   example: Invalid data format or missing required
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
 *                   example: "Weather data not found"
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

router.route('/update-precipitation/:id').patch(
  authController.protect,
  authController.restrictTo('teacher'), // 或者其他适当的角色
  weatherController.updatePrecipitation
);

/**
 * @openapi
 * /api/v1/weather/weather:
 *   get:
 *     summary: Get all weather data (Teacher and user only)
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
 *                 message:
 *                   type: string
 *                   example: Success, Get all weather data
 *                 data:
 *                   type: object
 *                   properties:
 *                     weather:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WeatherData'
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
 *               message: Error processing request
 */

/**
 * @openapi
 * /api/v1/weather/weather:
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
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Weather data successfully created
 *                 weather:
 *                   $ref: "#/components/schemas/NewWeatherData"
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
 *
 */

/**
 * @openapi
 * /api/v1/weather/batch:
 *   post:
 *     summary: Insert multiple weather readings (Teacher and Sensor only)
 *     tags: [Weather Readings]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/NewWeatherData'
 *     responses:
 *       200:
 *         description: Successfully added multiple weather readings
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
 *                     weather:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WeatherData'
 *       400:
 *         description: Bad Request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failure
 *                 message:
 *                   type: string
 *                   example: Invalid data format or missing required fields
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failure
 *                 message:
 *                   type: string
 *                   example: Unable to process request due to server error
 */

/**
 * @openapi
 * /api/v1/weather/{id}:
 *   get:
 *     summary: Get weather data by ID (Teacher and User only)
 *     tags: [Weather Readings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the weather data
 *     responses:
 *       200:
 *         description: Weather data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherData'
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
 *               message: Weather data not found
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
 *   patch:
 *     summary: Update weather data by ID (Teacher only)
 *     tags: [WeatherData]
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
 *               message: Weather data not found
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
 *               message: Weather data not found
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
  .route('/batch')
  .post(
    authController.protect,
    authController.restrictTo('teacher', 'sensor'),
    weatherController.createManyWeather
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('teacher', 'student'),
    weatherController.getWeather
  )
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
