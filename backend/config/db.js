const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-platform');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n⚠️  IP Whitelist Issue Detected!');
      console.error('To fix this:');
      console.error('1. Go to MongoDB Atlas Dashboard');
      console.error('2. Navigate to Network Access (Security > Network Access)');
      console.error('3. Click "Add IP Address"');
      console.error('4. Click "Add Current IP Address" or add 0.0.0.0/0 for development (less secure)');
      console.error('5. Wait a few minutes for changes to propagate');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
