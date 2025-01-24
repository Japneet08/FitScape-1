const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB connected successfully');
  } catch (err) {
    console.error('DB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;