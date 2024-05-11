const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @openapi
 * /api/v1/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - passwordConfirm
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Joye
 *               email:
 *                 type: string
 *                 format: email
 *                 example: teacher3@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: pass1234
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: pass1234
 *               role:
 *                 type: string
 *                 enum:
 *                   - teacher
 *                   - user
 *                   - sensor
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDYzODJhZTk1ZWUyNThlY2ZkODUzNCIsImlhdCI6MTcxMTY4MzYyNywiZXhwIjoxNzE5NDU5NjI3fQ.4Hihyt5oMTDW2hLRx0njN_sm0u3oE7bJgnxhfXlXeW8"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error or E11000 duplicate key error for email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: object
 *                   properties:
 *                     driver:
 *                       type: boolean
 *                       example: true
 *                     name:
 *                       type: string
 *                       example: "MongoError"
 *                     index:
 *                       type: integer
 *                       example: 0
 *                     code:
 *                       type: integer
 *                       example: 11000
 *                     keyPattern:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: integer
 *                           example: 1
 *                     keyValue:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           example: "teacher2@email.com"
 *                     statusCode:
 *                       type: integer
 *                       example: 500
 *                     status:
 *                       type: string
 *                       example: error
 *                 message:
 *                   type: string
 *                   example: "E11000 duplicate key error collection: weather-data-raw.users index: email_1 dup key: { email: \"teacher2@email.com\" }"
 */
router.post('/signup', authController.signup);

/**
 * @openapi
 * /api/v1/users/login:
 *   post:
 *     summary: Authenticate a user and receive a JWT for subsequent requests
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user1@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: pass1234
 *     responses:
 *       200:
 *         description: Authentication successful, JWT returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Unauthorized, possibly due to missing or invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: "Please provide email or password."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "An error occurred while processing the request."
 */
router.post('/login', authController.login);
router.patch('/updateMe', authController.protect, userController.updateMe);

/**
 * @openapi
 * /api/v1/users/create-user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - passwordConfirm
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Reece
 *               email:
 *                 type: string
 *                 example: user10@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: pass1234
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 example: pass1234
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         role:
 *                           type: string
 *                           example: user
 *                         _id:
 *                           type: string
 *                           example: 6625031841e8f860b8a47763
 *                         name:
 *                           type: string
 *                           example: Reece
 *                         email:
 *                           type: string
 *                           example: user10@email.com
 *                         lastLoggedIn:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-04-21T12:14:16.779Z
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-04-21T12:14:16.783Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-04-21T12:14:16.783Z
 *                         __v:
 *                           type: integer
 *                           example: 0
 *       400:
 *         $ref: '#/components/responses/400_InvalidRequest'
 *       401:
 *         $ref: '#/components/responses/401_Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 */
router.post(
  '/create-user',
  authController.protect,
  authController.restrictTo('teacher'),
  authController.createUser
);

/**
 * @openapi
 * /api/v1/users/last-login:
 *   delete:
 *     summary: Delete users with 'Student' role who last logged in between two dates
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         description: Start date of the range to check for users' last login
 *         schema:
 *           type: string
 *           format: date
 *           example: '2024-03-01'
 *       - in: query
 *         name: endDate
 *         required: true
 *         description: End date of the range to check for users' last login
 *         schema:
 *           type: string
 *           format: date
 *           example: '2024-04-22'
 *     responses:
 *       204:
 *         description: Users deleted successfully
 *       400:
 *         description: Bad request due to invalid input
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
 *                   example: "Unauthorized access, token missing or invalid."
 *       404:
 *         description: No users found with the specified role and date range
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
 *                   example: "No users found with 'Student' role and last login dates within the specified range."
 */
router
  .route('/last-login')
  .delete(
    authController.protect,
    authController.restrictTo('teacher'),
    userController.deleteUsersByLastLogin
  );

/**
 * @openapi
 * /api/v1/users/update-role:
 *   patch:
 *     summary: Update user roles based on user creation date range
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         description: Start date of the user creation range
 *         schema:
 *           type: string
 *           format: date
 *           example: '2024-04-01'
 *       - in: query
 *         name: endDate
 *         required: true
 *         description: End date of the user creation range
 *         schema:
 *           type: string
 *           format: date
 *           example: '2024-04-17'
 *       - in: query
 *         name: newRole
 *         required: true
 *         description: The new role to assign to users within the date range
 *         schema:
 *           type: string
 *           example: 'teacher'
 *     responses:
 *       200:
 *         description: The roles for the users have been updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "3 users' roles updated successfully"
 *       400:
 *         $ref: '#/components/responses/400_InvalidRequest'
 *       401:
 *         $ref: '#/components/responses/401_Unauthorized'
 *       404:
 *          $ref: '#/components/responses/403_ForbiddenError'
 */

router
  .route('/update-role')
  .patch(
    authController.protect,
    authController.restrictTo('teacher'),
    userController.updateUsersRole
  );

// Protect all routes after this middleware
router.use(authController.protect);
router.use(authController.restrictTo('teacher'));

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get a list of all users (Teacher only)
 *     description: Accessible by users with the 'teacher' role.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully get a list of users data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                   example: 6
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/500_DatabaseError'
 */

router.route('/').get(userController.getAllUsers);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a specific user by their ID (Teacher only)
 *     description: Accessible by users with the 'teacher' role.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: "#/components/responses/200_UserObject"
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/500_DatabaseError'
 */

/**
 * @openapi
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's new name
 *                 example: Phebe
 *     responses:
 *       200:
 *         description: User information updated successfully
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
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/401_Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       500:
 *         description: An internal server error occurred.
 */

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the user
 *         schema:
 *           type: string
 *           example: '6625031841e8f860b8a47763'
 *     responses:
 *       204:
 *         description: No Content, the user has been successfully deleted
 *       400:
 *         $ref: '#/components/responses/400_InvalidRequest'
 *       401:
 *         $ref: '#/components/responses/401_Unauthorized'
 *       404:
 *         $ref: '#/components/responses/404_BadRequest_User'
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
