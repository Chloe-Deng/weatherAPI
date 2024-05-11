const express = require('express');
const { Router } = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// const OpenApiValidator = require('express-openapi-validator');

const docs = Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Docs',
      description: 'A REST API for weather observation',
      version: '1.0.0',
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          schema: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.{js,yaml}', './controllers/*/*.js', './components.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

// Swagger page
docs.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Docs in JSON format
docs.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

module.exports = docs;
