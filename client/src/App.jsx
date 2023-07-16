import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { motion } from 'framer-motion';
import { HiOutlineClipboard, HiOutlineClipboardCheck } from 'react-icons/hi';
import { FcHome } from 'react-icons/fc';
import Modal from './components/Modal';
import JoinRoom from './components/JoinRoom';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function App() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [copyStatus, setCopyStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [generatedRoomNumber, setGeneratedRoomNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);

  console.log('room number:' + roomNumber);
  console.log('generated number' + generatedRoomNumber);
  const handleShowModal = () => {
    const generatedNumber = Math.floor(
      10000 + Math.random() * 90000
    ).toString();
    setGeneratedRoomNumber(generatedNumber);
    setShowModal(true);
  };
  const handleCreateRoom = async () => {
    const roomcode = generatedRoomNumber;
    setShowModal(!showModal);
    try {
      const response = await fetch(
        `http://localhost:5000/createRoom/${roomcode}`,
        {
          method: 'POST',
        }
      );
      const data = await response.json();

      if (response.ok) {
        if (data.message === 'Room and folder created successfully') {
          console.log('Room created:', roomcode);
          setRoomNumber(roomcode);
        } else if (data.error === 'Room already exists') {
          console.log('Room already exists:', roomcode);
        }
      } else {
        console.error('Error creating room:', data.error);
      }
    } catch (error) {
      console.error('Error creating room:', error.message);
    }
  };

  //join room
  const handleJoinRoom = async (roomNumber) => {
    try {
      const response = await fetch(
        `http://localhost:5000/getUploadedFiles/${roomNumber}`
      );
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data.files);
        setJoinRoomOpen(false);
        setRoomNumber(roomNumber);
        setGeneratedRoomNumber(roomNumber);
      } else {
        console.error('Error fetching uploaded files:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error.message);
    }
  };

  const handleJoinRoomClose = () => {
    setJoinRoomOpen(!joinRoomOpen);
  };

  const handleFileUpload = async () => {
    setFiles([]);
    try {
      const response = await fetch(
        `http://localhost:5000/getUploadedFiles/${roomNumber}`
      );
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

  const handleCopyLink = (file) => {
    const downloadLink = `http://localhost:5000/download/${generatedRoomNumber}/${file.name}`;
    navigator.clipboard
      .writeText(downloadLink)
      .then(() => {
        console.log('Link copied to clipboard:', downloadLink);
        setCopyStatus({ [file.name]: true });
        setTimeout(() => {
          setCopyStatus({ [file.name]: false });
        }, 3000);
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
      });
  };

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, backdropBlur: 0 }}
        animate={{
          opacity: showModal || joinRoomOpen ? 1 : 0,
          backdropBlur: showModal || joinRoomOpen ? '5px' : 0,
        }}
        transition={{ duration: 0.5 }}
        className={`${
          showModal || joinRoomOpen ? 'visible' : 'hidden'
        } backdrop-blur-sm bg-slate-900/70 fixed top-0 right-0 bottom-0 left-0 z-20`}
      />

      <div
        className={`relative  overflow-hidden before:absolute before:top-0 before:left-1/2 before:bg-[url('./assets/squared-bg-element.svg')] before:bg-no-repeat bg-center before:bg-top before:w-full before:h-full before:-z-[1] before:transform before:-translate-x-1/2 dark:before:bg-[url('./assets/squared-bg-element-dark.svg')]`}
      >
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          {/* Announcement Banner */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-xs text-gray-600 p-2 px-3 rounded-full transition hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-400">
              {generatedRoomNumber
                ? 'Your Current Room Is'
                : 'Move Your Files Easly'}
              <span className="flex items-center gap-x-1">
                <span className="border-l border-gray-200 text-blue-600 pl-2 dark:text-blue-500">
                  {generatedRoomNumber ? `${generatedRoomNumber}` : 'Fast 🚀'}
                </span>
              </span>
            </div>
          </div>
          {/* End Announcement Banner */}

          {/* Title */}
          <div className="mt-5 max-w-xl text-center mx-auto">
            <h1 className="block font-bold text-slate-800 text-4xl md:text-5xl lg:text-6xl dark:text-gray-200">
              <span className="bg-gradient-to-tr from-blue-500 to-cyan-300 text-transparent bg-clip-text">
                Supercharged
              </span>
              <span className="text-4xl">⚡</span> Transfer Experience
            </h1>
          </div>
          {/* End Title */}

          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-slate-600 dark:text-gray-400">
              Nama Website is a FileShare website, that can transfer your files
              rapidly.
            </p>
          </div>
          {/* Create Room Button */}
          <div className="flex justify-center mt-5">
            <button
              className={` flex gap-2 px-6 py-4 mt-4 mr-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
                roomNumber && 'hidden'
              }`}
              onClick={handleShowModal}
            >
              <FcHome size={20} />
              <p>Create Room</p>
            </button>

            {/* Join Room Button */}
            <button
              className={`px-6 py-4 mt-4 bg-slate-300 rounded-md  font-medium text-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:text-white dark:hover:bg-gray-800 dark:hover:border-gray-900 dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800 ${
                roomNumber && 'hidden'
              }`}
              onClick={() => setJoinRoomOpen(!joinRoomOpen)}
            >
              🚪 Join Room
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <Modal
              onClose={() => setShowModal(!showModal)}
              onAccept={handleCreateRoom}
              roomNumber={generatedRoomNumber}
            />
          )}
          {joinRoomOpen && (
            <JoinRoom onClose={handleJoinRoomClose} onJoin={handleJoinRoom} />
          )}
          <div
            className={`mt-8 md:w-5/12 lg:w-3/12 mx-auto ${
              !roomNumber ? 'hidden' : ''
            }`}
          >
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
                url: `http://localhost:5000/uploads/${roomNumber}`,
                process: {
                  method: 'POST',
                  withCredentials: false,
                  headers: {},
                  ondata: (formData) => {
                    return formData;
                  },
                },
              }}
              name="files"
              labelIdle={
                'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              }
              onprocessfile={() => handleFileUpload()}
            />

            {/* Short Link Form */}
          </div>
          <div className="flex gap-3 w-full flex-wrap justify-center mx-auto mt-8">
            {/* input link utama */}
            <form className="w-full  md:w-5/12 lg:w-3/12">
              <div className="relative z-10 flex space-x-2 p-2  bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/[.2]">
                <div className="flex-[1_0_0%]">
                  <label className="block text-sm text-gray-700 font-medium dark:text-white">
                    <span className="sr-only">Short link</span>
                  </label>
                  <input
                    type="text"
                    name="hs-search-article-1"
                    id="hs-search-article-1"
                    className="p-2 block w-full border-none focus:outline-none rounded-md ring-3  dark:text-gray-400"
                    placeholder="Link utama"
                  />
                </div>
              </div>
            </form>

            {/* input short link */}
            <form className="w-full  md:w-5/12 lg:w-3/12">
              <div className="relative z-10 flex space-x-2 p-2 justify-between  bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/[.2]">
                <div className="flex items-center">
                  <p className="p-2 pr-0 text-slate-500 font-semibold">
                    op.com/
                  </p>
                  <input
                    type="text"
                    name="hs-search-article-1"
                    id="hs-search-article-1"
                    className="p-2 block w-full pl-0 border-none focus:outline-none rounded-md ring-3  dark:text-gray-400"
                    placeholder="Short link"
                  />
                </div>
                <div className="self-end">
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
              key={index}
              className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800"
              onClick={() => handleCopyLink(file)}
            >
              <div className="p-4 md:p-5">
                <div className="flex items-start">
                  {copyStatus[file.name] ? (
                    <>
                      <div className="relative">
                        <HiOutlineClipboardCheck
                          size={20}
                          className="mt-1 text-green-500"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 0 }}
                          animate={{ opacity: 1, y: -5, scale: 1.2 }}
                          className="ml-2 px-2 py-1 rounded-md -top-5 -left-5 text-white bg-green-500 shadow-md absolute text-xs "
                        >
                          Copied
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    <HiOutlineClipboard size={20} className="mt-1" />
                  )}

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
            </motion.div>
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
