import { motion } from 'framer-motion';

function Modal({ onClose, roomNumber, onAccept }) {
  const handleAccept = () => {
    onAccept();
    redirectAfterAccept();
  };
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg p-6 w-80 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Room Code</h2>
        <p className="text-4xl mb-4 font-bold text-slate-700">{roomNumber}</p>
        <p className="text-sm font-thin">Please remember your room code</p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 mt-4 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 focus:outline-none focus:bg-slate-700"
            onClick={onAccept}
          >
            OK
          </button>
          <button
            className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Modal;
