import mongoose from 'mongoose';

const DB_NAME = 'campusTracker';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\nDB connected succesfully \nDB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error('Error while connecting to MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;
