require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...\n');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB connected');
  console.log(`   Host: ${mongoose.connection.host}`);
  console.log(`   Database: ${mongoose.connection.name}`);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ FAILED:', error.message);
  process.exit(1);
});
