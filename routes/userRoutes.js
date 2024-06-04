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
 *                 example: Rachel
 *               email:
 *                 type: string
 *                 format: email
 *                 example: teacher1@email.com
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
 *                       $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error
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
 *                   example: "Validation error: Password are not the same!"
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
 *                 example: teacher@email.com
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
 *         description: Bad request, possibly due to missing or invalid credentials.
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
 *       401:
 *         description: Unauthorized, invalid credentials.
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
 *                   example: "Incorrect email or password."
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

/**
 * @openapi
 * /api/v1/users/logout:
 *   post:
 *     summary: Log out a user by clearing the JWT from the cookies
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logout successful, JWT cleared from cookies.
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
 *                   example: "Logged out"
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
 *                   example: "An error occurred while processing the request."
 */
router.get('/logout', authController.logout);

router.use(authController.protect);

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
 *                 example: student@email.com
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
 *                 example: student
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
 *                           example: student
 *                         _id:
 *                           type: string
 *                           example: 6625031841e8f860b8a47763
 *                         name:
 *                           type: string
 *                           example: Reece
 *                         email:
 *                           type: string
 *                           example: student@email.com
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
 *       400:
 *         description: Validation error
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
 *                   example: "Validation error: Please tell us your name!"
 *       401:
 *         $ref: '#/components/responses/401_Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/500_Error'
 *
 */
router.post(
  '/create-user',
  authController.protect,
  authController.restrictTo('teacher'),
  userController.createUser
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
 *                   example: "You are not logged in! Please log in to get access."
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
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
 *       500:
 *         $ref: '#/components/responses/500_Error'
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
 *                   example: "Invalid date format."
 *       401:
 *         $ref: '#/components/responses/401_Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       404:
 *         description: Not Found
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
 *                   example: "No users found with creation dates within the specified range."
 *       500:
 *         description: Server Error
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
 *                   example: "Error updating user role."
 */

router
  .route('/update-role')
  .patch(
    authController.protect,
    authController.restrictTo('teacher'),
    userController.updateUsersRole
  );

// Protect all routes after this middleware

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
 *                   example: 2
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *               example:
 *                 status: success
 *                 results: 2
 *                 data:
 *                   users:
 *                     - _id: "66052e5c89bb66798c905c16"
 *                       name: "Rachel"
 *                       email: "teacher1@email.com"
 *                       password: "pass1234"
 *                       passwordConfirmed: "pass1234"
 *                       role: "teacher"
 *                     - _id: "66052e5c89bb66798c905c17"
 *                       name: "John"
 *                       email: "teacher2@email.com"
 *                       password: "pass5678"
 *                       passwordConfirmed: "pass5678"
 *                       role: "teacher"
 *       401:
 *         $ref: '#/components/responses/401_Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       404:
 *         description: Not found
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
 *                   example: "Can't find /api/v/weather?page=5&limit=20 on this server."
 *       500:
 *         $ref: '#/components/responses/500_Error'
 */

router.route('/').get(userController.getAllUsers);

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
 *       400:
 *         description: Validation error
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
 *                   example:  "Validation error: Please provide a valid email"
 *       401:
 *         $ref: '#/components/responses/401_Unauthorized'
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       404:
 *         description: Not found
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
 *                   example: "No user found for this ID."
 *       500:
 *         description: Server Error
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
 *                   example: "An error occurred during the update!"
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
 *       403:
 *         $ref: '#/components/responses/403_ForbiddenError'
 *       500:
 *         description: Server Error
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
 *                   example: "An error occurred during deleting user!"
 */
router
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
