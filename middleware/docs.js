// import { Router } from 'express';
// import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import * as OpenApiValidator from 'express-openapi-validator';

// const docs = Router();

// // Setup swagger JSDoc - it will read our code documents and generate
// // and OpenAPi specification file for all of our routes
// const options = {
//   failOnErrors: true,
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       version: '1.0.0',
//       title: 'Animal Spotting API',
//       description: 'JSON RES API for tracking animal sightings',
//     },
//     components: {
//       securitySchemes: {
//         JWT: {
//           type: 'apiKey',
//           in: 'header',
//           name: 'Authorization',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//     },
//   },
//   apis: ['./src/routes/*{js,ymal}', './src/middleware/docs.js'],
// };
// const specification = swaggerJSDoc(options);
// // console.log(specification);

// //Setup SwaggerUI - This will serve an interactive webpage that documents
// //

// /**
//  * @openapi
//  *
//  * /docs:
//  *      get:
//  *          summary: "View automatically generated API documentation"
//  *          responses:
//  *              '200':
//  *                   description: "Swagger documentation page"
//  */
// docs.use('/docs', swaggerUi.serve, swaggerUi.setup(specification));

// // Setup OpenAPIValidator - This will automatically check that every route
// // adheres to the documentation (i.e. will validate every request and response)
// docs.use(
//   OpenApiValidator.middleware({
//     apiSpec: specification,
//     validateRequests: true,
//     validateResponses: true,
//   })
// );

// export default docs;
