import mongoose from 'mongoose';
const dotenv = require('dotenv');

dotenv.config();

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Success connection MongoDB with Mongoose');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Terminar el proceso con un error
  }
};

export { connectToDatabase };