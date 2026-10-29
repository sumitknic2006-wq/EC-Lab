import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas using Mongoose.
 * Reads the connection URI strictly from process.env.MONGODB_URI.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

/**
 * Promise that resolves with the native MongoClient from Mongoose once connected.
 * Compatible with connect-mongo clientPromise option without establishing redundant connection pools.
 */
export const clientPromise = new Promise((resolve) => {
  if (mongoose.connection.readyState === 1 && mongoose.connection.getClient()) {
    resolve(mongoose.connection.getClient());
  } else {
    mongoose.connection.once('open', () => {
      resolve(mongoose.connection.getClient());
    });
  }
});

export default connectDB;
