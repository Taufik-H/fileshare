const express = require('express');
const multer = require('multer');
const cors = require('cors');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const roomNumber = req.params.roomNumber;
    const destinationFolder = path.join(__dirname, 'uploads', roomNumber);
    fs.mkdirSync(destinationFolder, { recursive: true });
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const modifiedName = originalName.toLowerCase().replace(/ /g, '_');
    cb(null, modifiedName);
  },
});

const upload = multer({ storage });

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
    const modifiedName = originalName.toLowerCase().replace(/ /g, '_');
    return {
      name: modifiedName,
      size: file.size,
      type: path.extname(file.originalname).toLowerCase().replace('.', ''),
    };
  });

  res.status(200).json({ files: files });
  scheduleFolderDeletion(roomNumber);
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

app.get('/downloadAll/:roomNumber', (req, res) => {
  const roomNumber = req.params.roomNumber;
  const folderPath = path.join(__dirname, 'uploads', roomNumber);

  const folderExists = fs.existsSync(folderPath);
  if (!folderExists) {
    return res.status(404).json({ error: 'Folder not found' });
  }

  const zipPath = path.join(
    __dirname,
    'public',
    'downloads',
    `${roomNumber}.zip`
  );

  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  archive.on('warning', (err) => {
    console.warn(err);
  });

  archive.on('error', (err) => {
    console.error(err);
    res.status(500).json({ error: 'Failed to create zip file' });
  });

  archive.pipe(output);
  archive.directory(folderPath, false);
  archive.finalize();

  output.on('close', () => {
    console.log('Zip file created:', zipPath);
    res.download(zipPath, `${roomNumber}.zip`, (err) => {
      if (err) {
        console.error('Error downloading zip file:', err);
        res.status(500).json({ error: 'Failed to download zip file' });
      } else {
        fs.unlink(zipPath, (err) => {
          if (err) {
            console.warn('Failed to remove zip file:', err);
          } else {
            console.log('Zip file removed:', zipPath);
          }
        });
      }
    });
  });
});

app.delete('/deleteRoom/:roomNumber', (req, res) => {
  const roomNumber = req.params.roomNumber;
  const folderPath = path.join(__dirname, 'uploads', roomNumber);

  fs.rmdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.error('Error deleting room folder:', err);
      res.status(500).json({ error: 'Failed to delete room folder' });
    } else {
      console.log('Room folder deleted:', folderPath);
      res.status(200).json({ message: 'Room folder deleted successfully' });
    }
  });
});
// auto delete 3 jam
const THREE_HOURS = 3 * 60 * 60 * 1000;

const scheduleFolderDeletion = (roomNumber) => {
  setTimeout(() => {
    const folderPath = path.join(__dirname, 'uploads', roomNumber);
    fs.rmdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error deleting room folder:', err);
      } else {
        console.log('Room folder deleted:', folderPath);
      }
    });
  }, THREE_HOURS);
};

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
