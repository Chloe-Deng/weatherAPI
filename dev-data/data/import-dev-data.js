const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// .current folder/ ..one level up to the dev-data folder/ ..one level up to the main folder/ into the models
const Weather = require('../../models/weatherModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connection successful');
  });

// READ JSON FILE
const weatherData = JSON.parse(
  fs.readFileSync(`${__dirname}/weather-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    // .create accept object and an array of objects
    await Weather.create(weatherData);
    console.log('Data successfully imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE DATA
const deleteData = async () => {
  try {
    await Weather.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
