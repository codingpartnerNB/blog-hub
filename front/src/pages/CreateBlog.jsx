import { useBlog } from '../context/BlogContext';
import BlogForm from '../components/BlogForm';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function CreateBlog() {
  const { createBlog, loading } = useBlog();
  
  const handleSubmit = async (blogData) => {
    try {
      await createBlog(blogData);
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          to="/blogs" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Blogs
        </Link>
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create Your Blog Masterpiece
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Share your knowledge, stories, and ideas with our vibrant community of readers.
        </p>
      </motion.div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3"></span>
            Blog Details
          </h2>
        </div>
        
        {/* Form Content */}
        <div className="p-6 md:p-8">
          <BlogForm 
            onSubmit={handleSubmit} 
            isSubmitting={loading} 
          />
        </div>

        {/* Form Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
          <p>Your blog will be visible to the community after submission.</p>
        </div>
      </motion.div>

      {/* Inspiration Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6"
      >
        <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3"></span>
          Writing Tips
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Start with a compelling headline that grabs attention
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Use clear, concise language and short paragraphs
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            Add images to break up text and illustrate points
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            End with a question or call-to-action to engage readers
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default CreateBlog;