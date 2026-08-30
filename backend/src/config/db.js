const mongoose = require('mongoose');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const mongoUri = process.env.MONGODB_URI;

  // In production, MONGODB_URI must be explicitly set — never fall back to localhost
  if (isProduction && !mongoUri) {
    console.error('FATAL: MONGODB_URI environment variable is not set in production.');
    console.error('Set MONGODB_URI in Render Dashboard → Environment.');
    process.exit(1);
  }

  const uri = mongoUri || 'mongodb://localhost:27017/ai-ambulance';

  // Log a sanitized version of the URI (hide password)
  const sanitized = uri.replace(/:([^@/]+)@/, ':****@');
  console.log(`Attempting MongoDB connection to: ${sanitized}`);

  const MAX_RETRIES = isProduction ? 5 : 1;
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return; // success
    } catch (error) {
      lastError = error;
      console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);
      if (attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // 1s, 2s, 4s, 8s, 10s
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries exhausted
  if (isProduction) {
    console.error(`FATAL: Could not connect to MongoDB after ${MAX_RETRIES} attempts.`);
    console.error(`Last error: ${lastError.message}`);
    process.exit(1);
  } else {
    console.error(`Error: ${lastError.message}`);
    console.log('Running without DB connection for now (development mode).');
  }
};

module.exports = connectDB;
