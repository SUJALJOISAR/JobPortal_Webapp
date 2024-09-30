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
    cb(null, file.originalname); // Save the file with the original name
  }
});

const upload = multer({ storage });

export default upload;