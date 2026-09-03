const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is configured
    if (!process.env.MONGODB_URI) {
      throw new Error(
        'MONGODB_URI is not defined in environment variables. ' +
        'Please copy .env.example to .env and configure your MongoDB connection.'
      );
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are no longer needed in Mongoose 6+
      // but included for compatibility
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;
