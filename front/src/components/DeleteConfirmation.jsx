import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function DeleteConfirmation({ isOpen, onClose, onConfirm, isDeleting, title }) {
  const modalRef = useRef(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fix for SSR hydration issues
  useEffect(() => {
    setIsBrowser(true);
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMounted) {
        onClose();
      }
    };

    if (isOpen && isBrowser && isMounted) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (isBrowser && isMounted) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClose, isBrowser, isMounted]);

  const handleConfirmClick = async () => {
    setIsProcessing(true); // Start processing
    try {
      await onConfirm(); // Call the onConfirm function
      onClose(); // Automatically close the modal after successful deletion
    } catch (error) {
      console.error('Error during deletion:', error);
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  if (!isOpen || !isBrowser) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close modal"
              disabled={isProcessing} // Disable close button while processing
            >
              <FiX className="h-5 w-5 text-gray-500" />
            </button>
            
            {/* Modal content */}
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* Warning icon */}
                <div className="relative mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-red-100 rounded-full"
                  />
                  <div className="relative flex items-center justify-center h-16 w-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full border-2 border-red-200">
                    <FiAlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <span className="font-semibold text-gray-800">"{title}"</span>? This action cannot be undone.
                </p>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  disabled={isProcessing} // Disable cancel button while processing
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClick}
                  disabled={isProcessing} // Disable delete button while processing
                  className="relative px-6 py-3 rounded-lg bg-gradient-to-br from-red-600 to-red-500 text-white font-medium hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
                >
                  <span className={`transition-opacity duration-200 ${isProcessing ? 'opacity-0' : 'opacity-100'}`}>
                    Delete Permanently
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isProcessing ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                </button>
              </div>
            </div>
            
            {/* Warning footer */}
            <div className="bg-red-50 px-6 py-4 border-t border-red-100">
              <div className="flex items-start text-red-600">
                <FiAlertTriangle className="flex-shrink-0 h-4 w-4 mt-0.5 mr-2" />
                <p className="text-sm">This will permanently remove the item and all associated data.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default DeleteConfirmation;