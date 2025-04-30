import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import BlogForm from '../components/BlogForm';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertTriangle, FiEdit2 } from 'react-icons/fi';

function EditBlog() {
  const { id } = useParams();
  const { fetchBlogById, updateBlog, currentBlog, loading } = useBlog();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await fetchBlogById(id);
        if (data) {
          setBlog(data);
        } else {
          setError('Blog not found');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to fetch the blog');
      }
    };

    loadBlog();
  }, [fetchBlogById, id]);

  // Update local state when currentBlog changes in context
  useEffect(() => {
    if (currentBlog && currentBlog._id === id) {
      setBlog(currentBlog);
    }
  }, [currentBlog, id]);

  const handleSubmit = async (blogData) => {
    setIsSubmitting(true);
    try {
      const updatedBlog = await updateBlog(id, blogData);
      // Update local state with the returned updated blog
      setBlog(updatedBlog);
      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error('Error updating blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
      >
        <div className="bg-gradient-to-r from-red-100 to-pink-100 p-6 rounded-full mb-6">
          <FiAlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{error}</h2>
        <p className="text-gray-600 max-w-md mb-8">
          The blog you're trying to edit doesn't exist or you don't have permission to edit it.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary flex items-center group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </motion.div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-75 animate-ping"></div>
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
            <FiEdit2 className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-600">Loading your blog post...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Edit Your Blog Post
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Refine your content and make it even more impactful.
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
            Edit Blog Details
          </h2>
        </div>
        
        {/* Form Content */}
        <div className="p-6 md:p-8">
          <BlogForm 
            initialData={blog} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting || loading} 
          />
        </div>

        {/* Form Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
          <p>Your changes will be visible to the community after saving.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default EditBlog;