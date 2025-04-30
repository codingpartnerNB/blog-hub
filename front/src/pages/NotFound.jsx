import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCompass } from 'react-icons/fi';

function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4"
    >
      {/* Animated 404 Illustration */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mb-10"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-50 animate-ping"></div>
        <div className="relative h-40 w-40 bg-white rounded-full shadow-xl flex items-center justify-center border-8 border-white">
          <div className="text-center">
            <span className="block text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              404
            </span>
            <FiCompass className="h-12 w-12 mx-auto mt-2 text-gray-400" />
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center max-w-md"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Lost in the Digital Wilderness
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or may have been moved. 
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="btn-gradient flex items-center justify-center group hover:shadow-lg transition-all duration-300 p-3 rounded-lg"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <Link
            to="/blogs"
            className="btn-outline flex items-center justify-center group hover:bg-gray-50 transition-colors duration-200 p-3 rounded-lg"
          >
            Explore Blogs
          </Link>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-10 left-10 text-8xl font-bold text-gray-200 select-none"
      >
        404
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute top-10 right-10 text-8xl font-bold text-gray-200 select-none"
      >
        404
      </motion.div>
    </motion.div>
  );
}

export default NotFound;