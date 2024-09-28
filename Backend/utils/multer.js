// import multer from "multer";

// const storage=multer.memoryStorage();
// export const singleUpload = multer({storage}).single("file");


import multer from 'multer';
import path from 'path';

// Configure the storage destination and file naming
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the folder where files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Unique name with extension
  }
});

const upload = multer({ storage });

export default upload;