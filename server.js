const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

const port = 3001 || process.env.PORT;
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}...`);
  console.log(`Docs available at http://localhost:${port}/docs`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION 💥 Shutting down...');

  // Give the server time to finish all the requests that are still pending or be handled by that time
  server.close(() => {
    process.exit(1);
  });
});
