const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/syncpoll';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Warning: Could not connect to local MongoDB. App running with in-memory state fallback. Error: ${error.message}`);
  }
};

module.exports = connectDB;
