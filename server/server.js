const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    // Extract the file extension
    const ext = path.extname(file.originalname);
    // Generate a unique filename with the original extension
    const uniqueFilename = `${Date.now()}${ext}`;
    cb(null, uniqueFilename);
  },
});
const upload = multer({ storage });

// Configure CORS
app.use(cors());

// Serve static files
app.use(express.static('public'));

// Handle file uploads
app.post('/uploads', upload.array('files'), (req, res) => {
  // Access the uploaded files using req.files array
  console.log(req.files);

  // Perform additional processing or file validation as needed

  // Send a response indicating successful upload
  res.status(200).json({ message: 'Files uploaded successfully' });
});

// Retrieve uploaded file data
app.get('/getUploadedFiles', (req, res) => {
  // Get the list of uploaded files from the 'uploads' directory
  const fs = require('fs');
  const directoryPath = path.join(__dirname, 'uploads');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).json({ error: 'Failed to retrieve uploaded files' });
    } else {
      // Create an array to hold the file data
      const uploadedFiles = [];

      // Iterate through the files and collect the required information
      files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const { size } = fs.statSync(filePath);
        const fileData = {
          name: file,
          size: size,
          type: path.extname(file).replace('.', ''),
        };
        uploadedFiles.push(fileData);
      });

      // Send the array of uploaded file data as the response
      res.status(200).json({ files: uploadedFiles });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
