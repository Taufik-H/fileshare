import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';

import { motion, AnimatePresence } from 'framer-motion';

// Import the necessary plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function App() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = async () => {
    // Perform any additional processing or validation if needed

    // Clear the FilePond
    setFiles([]);

    // Fetch the uploaded file data from the server
    try {
      const response = await fetch('http://localhost:5000/getUploadedFiles');
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data.files);
      } else {
        console.error('Error fetching uploaded files:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl mb-8">File Sharing Website</h1>

      <div className="w-96">
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          acceptedFileTypes={[
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4',
          ]}
          allowMultiple={true}
          maxFiles={3}
          server={{
            url: 'http://localhost:5000/uploads',
            process: {
              method: 'POST',
              withCredentials: false,
              headers: {},
            },
          }}
          name="files"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          onprocessfile={() => handleFileUpload()}
        />
      </div>

      <div className="mt-8">
        <AnimatePresence initial={false}>
          {uploadedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-lg rounded-md p-4 mb-4"
            >
              <div>File Name: {file.name}</div>
              <div>File Size: {file.size} bytes</div>
              <div>File Type: {file.type}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
