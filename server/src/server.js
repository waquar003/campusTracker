import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/database.js';

dotenv.config({});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port: ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.log('Error while connecting to DB', error);
  });
