import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resilience-engine';

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
};

// Start server
const startServer = async () => {
  // Attempt MongoDB connection (but don't block server start if it fails)
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.warn('⚠️  Server starting without MongoDB connection');
    console.warn('⚠️  Member 4 AI Nudge and demo features will still work');
  }

  // Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 Resilience Engine Backend running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 Gemini AI: ${process.env.GEMINI_API_KEY ? 'configured' : 'off (fallback only)'}`);
    console.log(`\nEndpoints:`);
    console.log(`  - Member 1: http://localhost:${PORT}/api/*`);
    console.log(`  - Member 4: http://localhost:${PORT}/nudge`);
    console.log(`  - Member 4: http://localhost:${PORT}/demo/profiles`);
    console.log(`  - Member 4: http://localhost:${PORT}/schemes/analyse`);
  });
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, closing server...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT received, closing server...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});
