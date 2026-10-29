import dotenv from 'dotenv';

// Load environment variables before initializing database and app
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Connect to MongoDB before accepting incoming requests
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`EC LAB server is running on port ${PORT}`);
    });

    // Graceful error handling for server startup failures
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        console.error('Server encountered an error:', error);
        process.exit(1);
      }

      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${PORT} requires elevated privileges.`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`Port ${PORT} is already in use.`);
          process.exit(1);
          break;
        default:
          console.error('Server failed to start:', error.message);
          process.exit(1);
      }
    });
  } catch (error) {
    console.error('Server initialization failed:', error.message);
    process.exit(1);
  }
};

startServer();
