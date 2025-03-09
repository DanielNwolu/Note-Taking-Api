import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().then(() => {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
});