import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { RiDownloadCloud2Line } from 'react-icons/ri';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// import './App.css';
function App() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = async () => {
    setFiles([]);

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
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden before:absolute before:top-0 before:left-1/2 before:bg-[url('./assets/squared-bg-element.svg')] before:bg-no-repeat before:bg-top before:w-full before:h-full before:-z-[1] before:transform before:-translate-x-1/2 dark:before:bg-[url('../svg/component/squared-bg-element-dark.svg')]">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          {/* Announcement Banner */}
          <div className="flex justify-center">
            <a
              className="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-xs text-gray-600 p-2 px-3 rounded-full transition hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-400"
              href="#"
            >
              Move Your Files Easly
              <span className="flex items-center gap-x-1">
                <span className="border-l border-gray-200 text-blue-600 pl-2 dark:text-blue-500">
                  Fast
                </span>
                <svg
                  className="w-2.5 h-2.5 text-blue-600"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </a>
          </div>
          {/* End Announcement Banner */}

          {/* Title */}
          <div className="mt-5 max-w-xl text-center mx-auto">
            <h1 className="block font-bold text-slate-800 text-4xl md:text-5xl lg:text-6xl dark:text-gray-200">
              <span className="bg-gradient-to-tr from-blue-500 to-cyan-300 text-transparent bg-clip-text">
                Supercharged
              </span>{' '}
              Transfer Experience
            </h1>
          </div>
          {/* End Title */}

          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-slate-600 dark:text-gray-400">
              Nama Website is a FileShare website, that can transfer your files
              rapidly.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 md:w-5/12 lg:w-3/12 mx-auto ">
            <FilePond
              allowPaste={true}
              instantUpload={false}
              credits={false}
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
              labelIdle={
                'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              }
              onprocessfile={() => handleFileUpload()}
            />
            {/* Short Link Form */}
            <div className="max-w-3xl mx-auto mt-8">
              <form>
                <div className="relative z-10 flex space-x-2 p-2  bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/[.2]">
                  <div class="flex-[1_0_0%]">
                    <label
                      for="hs-search-article-1"
                      class="block text-sm text-gray-700 font-medium dark:text-white"
                    >
                      <span class="sr-only">Short link</span>
                    </label>
                    <input
                      type="text"
                      name="hs-search-article-1"
                      id="hs-search-article-1"
                      className="p-2 block w-full border-none focus:outline-none rounded-md ring-3  dark:text-gray-400"
                      placeholder="Short link"
                    />
                  </div>
                  <div className="flex-[0_0_auto]">
                    <a
                      className="p-2 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                      href="#"
                    >
                      Shorten
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* End Buttons */}
        </div>
      </div>
      {/* End Hero */}

      {/* Card Section */}
      <div className="max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Uploaded Files */}
          {uploadedFiles.map((file, index) => (
            <a
              key={index}
              className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800"
              href={`http://localhost:5000/download/${file.name}`}
            >
              <div className="p-4 md:p-5">
                <div className="flex items-start">
                  <RiDownloadCloud2Line size={20} className="mt-1" />

                  <div className="grow ml-5">
                    <h3 className="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-gray-400 dark:text-gray-200">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))}
          {/* End Uploaded Files */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Card Section */}
    </div>
  );
}

export default App;
