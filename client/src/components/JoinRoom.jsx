import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { motion } from 'framer-motion';
function JoinRoom({ onClose, onJoin }) {
  const [roomNumber, setRoomNumber] = useState('');

  const handleRoomNumberChange = (event) => {
    setRoomNumber(event.target.value);
  };

  const handleJoin = (event) => {
    event.preventDefault();
    onJoin(roomNumber);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg p-6 w-80"
      >
        <div className="flex justify-end">
          <button
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
            onClick={onClose}
          >
            <AiOutlineClose size={18} />
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4">Join Room</h2>
        <form onSubmit={handleJoin}>
          <div className="relative z-10 w-full flex space-x-3 p-3 bg-white border rounded-lg shadow-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/[.2]">
            <div className="flex-1">
              <input
                type="text"
                name="join-room-input"
                id="join-room-input"
                className="p-2 block w-full rounded-md focus:outline-none dark:bg-gray-800 dark:text-gray-400"
                placeholder="Enter Room Number"
                value={roomNumber}
                onChange={handleRoomNumberChange}
              />
            </div>
            <div>
              <button
                type="submit"
                className="p-3 px-6 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 focus:outline-none focus:bg-slate-700"
              >
                Join
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default JoinRoom;
