import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,  // Environment variables should be uppercase and match the .env file
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

export default cloudinary;
