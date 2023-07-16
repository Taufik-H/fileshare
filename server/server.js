const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const roomNumber = req.params.roomNumber;
    const destinationFolder = path.join(__dirname, 'uploads', roomNumber);
    fs.mkdirSync(destinationFolder, { recursive: true });
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const modifiedName = originalName.toLowerCase().replaceAll(' ', '_');
    cb(null, modifiedName);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.static('public'));

app.post('/createRoom/:roomNumber', (req, res) => {
  const roomNumber = req.params.roomNumber;
  const folderPath = path.join(__dirname, 'uploads', roomNumber);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    res.status(200).json({ message: 'Room and folder created successfully' });
  } else {
    res.status(409).json({ error: 'Room already exists' });
  }
});

app.post('/uploads/:roomNumber', upload.array('files'), (req, res) => {
  const roomNumber = req.params.roomNumber;
  const files = req.files.map((file) => {
    const originalName = file.originalname;
    const modifiedName = originalName.toLowerCase().replaceAll(' ', '_');
    return {
      name: modifiedName,
      size: file.size,
      type: path
        .extname(file.originalname)
        .toLocaleLowerCase()
        .replace('.', ''),
    };
  });
  res.status(200).json({ files: files });
});

app.get('/getUploadedFiles/:roomNumber', (req, res) => {
  const roomNumber = req.params.roomNumber;
  const directoryPath = path.join(__dirname, 'uploads', roomNumber);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).json({ error: 'Failed to retrieve uploaded files' });
    } else {
      const uploadedFiles = files.map((file) => {
        const filePath = path.join(directoryPath, file);
        const { size } = fs.statSync(filePath);
        return {
          name: file,
          size: size,
          type: path.extname(file).replace('.', ''),
        };
      });
      res.status(200).json({ files: uploadedFiles });
    }
  });
});

app.get('/download/:roomNumber/:filename', (req, res) => {
  const roomNumber = req.params.roomNumber;
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', roomNumber, filename);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
