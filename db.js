const mongoose = require('mongoose');

/**
 * Connect to MongoDB and return the mongoose promise.
 * Do NOT exit the process here; allow caller to handle failures and logging.
 */
const connectDB = () => {
  return mongoose.connect(process.env.MONGO_URI, {
    // Use recommended options if needed; mongoose 6+ uses sensible defaults
    serverSelectionTimeoutMS: 5000, // fail fast if cannot connect
  });
};

module.exports = connectDB;