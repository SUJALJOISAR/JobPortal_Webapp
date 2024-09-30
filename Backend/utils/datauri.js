import DataUriParser from 'datauri/parser.js';
import path from 'path';
import fs from 'fs';

export const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  
  // Read file from disk
  const fileData = fs.readFileSync(file.path);
  console.log("File Data:", fileData); // Log the file data
  
  return parser.format(extName, fileData);  // Use file data read from disk
};
