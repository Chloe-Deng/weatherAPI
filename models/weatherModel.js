const mongoose = require('mongoose');
const slugify = require('slugify');
const Log = require('./logModel');

const AppError = require('../utils/appError');

// Create a Schema
const weatherSchema = new mongoose.Schema({
  humidity: {
    type: Number,
    required: [true, 'A weather data should have humidity'],
  },
  latitude: {
    type: Number,
    min: [-180, 'Latitude cannot be less than -180'],
    max: [180, 'Latitude cannot exceed 180'],
  },
  atmosphericPressure: {
    type: Number,
    min: [0, 'Atmospheric pressure cannot be negative'],
  },
  deviceName: {
    type: String,
    required: [true, 'Device name is required'],
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [-180, 'Longitude cannot be less than -180'],
    max: [180, 'Longitude cannot exceed 180'],
  },
  maxWindSpeed: {
    type: Number,
    min: [0, 'Wind speed cannot be negative'],
  },
  solarRadiation: {
    type: Number,
    min: [0, 'Solar radiation cannot be negative'],
  },
  temperature: {
    type: Number,
    required: [true, 'Temperature is required'],
  },
  time: {
    type: Date,
    required: [true, 'Time of data collection is required'],
  },
  vaporPressure: {
    type: Number,
    min: [0, 'Vapor pressure cannot be negative'],
  },
  windDirection: {
    type: Number,
    min: [0, 'Wind direction cannot be negative'],
    max: [360, 'Wind direction must be within 0-360 degrees'],
  },
  precipitation: {
    type: Number,
    min: [0, 'Precipitation cannot be negative'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

weatherSchema.pre('save', async function (next) {
  try {
    if (
      this.humidity > 100 ||
      this.temperature > 60 ||
      this.temperature < -50
    ) {
      const logEntry = new Log({
        documentId: this._id,
        document: this.toObject(),
        deletedAt: new Date(),
        type: 'invalid-data-deletion',
      });
      await logEntry.save();

      next(
        new AppError(
          'Invalid weather readings, document will not be saved.',
          400
        )
      );
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

weatherSchema.pre('findOneAndDelete', async function (next) {
  try {
    const docToDelete = await this.model.findOne(this.getQuery()).lean();
    if (docToDelete) {
      const logEntry = new Log({
        documentId: docToDelete._id,
        document: docToDelete,
        deletedAt: new Date(),
        type: 'deletion',
      });
      await logEntry.save(); // save to logs collection
    } else {
      const err = new Error('No document found with that ID');
      err.statusCode = 404;
      err.status = 'fail';
      next(err);
    }
    next();
  } catch (err) {
    // Capture the error that happened when save the document to the log
    next(err);
  }
});

// Create a Weather model
const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;

// Trigger in database-level
/*
exports = function (changeEvent) {
  const fullDocument = changeEvent.fullDocument;

  const db = context.services.get('Cluster1').db('weather-data-raw');
  const collection = db.collection('weathers');
  const logCollection = db.collection('logs');

  if (changeEvent.operationType === 'delete') {
    const documentId = changeEvent.documentKey._id;

    const logEntry = {
      documentId: documentId,
      deletedAt: new Date(),
      type: 'deletion',
    };

    logCollection
      .insertOne(logEntry)
      .then((result) => {
        console.log('Deletion of document logged in `log` collection.');
      })
      .catch((error) => {
        console.error('Error logging deletion of document:', error);
      });
  } else if (
    changeEvent.operationType === 'insert' ||
    changeEvent.operationType === 'update'
  ) {
    const humidity = fullDocument.humidity;
    const temperature = fullDocument.temperature;

    if (humidity > 100 || temperature > 60 || temperature < -50) {
      logCollection
        .insertOne({
          ...fullDocument,
          deletionReason: 'Invalid weather reading',
        })
        .then((result) => {
          console.log('Invalid weather reading logged in `log` collection.');

          return collection.deleteOne({ _id: fullDocument._id });
        })
        .then((result) => {
          console.log('Document with invalid weather readings deleted.');
        })
        .catch((error) => {
          console.error('Error with logging/deleting invalid document:', error);
        });
    }
  }
};
*/
