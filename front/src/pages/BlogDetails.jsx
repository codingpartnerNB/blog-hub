import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import { FiCalendar, FiUser, FiEdit, FiMessageCircle, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import { motion } from 'framer-motion';

function BlogDetails() {
  const { id } = useParams();
  const { currentBlog, fetchBlogById, loading: blogLoading } = useBlog();
  const { user, isAuthenticated } = useAuth();
  const [imageStatus, setImageStatus] = useState('loading'); // 'loading', 'loaded', 'error'
  const [localLoading, setLocalLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchBlogData = useCallback(async () => {
    try {
      setLocalLoading(true);
      setNotFound(false);
      await fetchBlogById(id);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setNotFound(true);
    } finally {
      setLocalLoading(false);
    }
  }, [fetchBlogById, id]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      await fetchBlogData();
      if (isMounted) {
        setImageStatus('loading'); // Reset image state when blog changes
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchBlogData, id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isAuthor = isAuthenticated && 
                  currentBlog && 
                  user && 
                  currentBlog.author && 
                  currentBlog.author._id === user._id;

  if (localLoading || blogLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-75 animate-ping"></div>
            <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
              <div className="animate-pulse h-6 w-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (notFound || !currentBlog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="bg-gradient-to-r from-red-100 to-pink-100 p-6 rounded-full mb-6">
          <FiAlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Blog Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The blog you're looking for doesn't exist or may have been removed.
        </p>
        <Link 
          to="/blogs" 
          className="btn-primary flex items-center group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to All Blogs
        </Link>
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
      {/* Back button */}
      <div className="mb-6">
        <Link 
          to="/blogs" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Blogs
        </Link>
      </div>

      {/* Blog header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {currentBlog.title}
        </h1>
        
        <div className="flex flex-wrap items-center text-gray-600 mb-6 gap-4">
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <FiCalendar className="mr-2 text-blue-500" />
            <span>{formatDate(currentBlog.createdAt)}</span>
          </div>
          
          {currentBlog.author && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <FiUser className="mr-2 text-blue-500" />
              <span>{currentBlog.author.name}</span>
            </div>
          )}
          
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <FiMessageCircle className="mr-2 text-blue-500" />
            <span>{currentBlog.comments?.length || 0} comments</span>
          </div>
          
          {isAuthor && (
            <Link 
              to={`/blogs/edit/${currentBlog._id}`}
              className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors duration-200"
            >
              <FiEdit className="mr-2" />
              Edit
            </Link>
          )}
        </div>
      </div>
      
      {/* Featured image with improved loading handling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] mb-10 rounded-xl overflow-hidden shadow-xl bg-gray-100"
      >
        {imageStatus === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse rounded-full bg-gray-200 h-12 w-12"></div>
          </div>
        )}
        
        {imageStatus === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500">
            <FiAlertTriangle className="h-12 w-12 mb-2" />
            <p>Image failed to load</p>
          </div>
        )}
        
        <img 
          src={currentBlog.image} 
          alt={currentBlog.title} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
          loading="eager"
          key={`image-${currentBlog._id}-${Date.now()}`} // Unique key for each image
        />
      </motion.div>
      
      {/* Author section */}
      {currentBlog.author ? (
        currentBlog.author.profileImage ? (
          <div className="relative h-14 w-14 rounded-full overflow-hidden mr-4 border-2 border-white shadow-md">
            <img 
              src={`${import.meta.env.VITE_BACKEND_PATH}${currentBlog.author.profileImage}`}  
              alt={currentBlog.author.name || 'Author'} 
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="h-full w-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                    <span class="text-xl font-semibold text-blue-600">
                      ${currentBlog.author.name?.charAt(0)?.toUpperCase() || ''}
                    </span>
                  </div>
                `;
              }}
            />
          </div>
        ) : (
          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-4 border-2 border-white shadow-md">
            <span className="text-xl font-semibold text-blue-600">
              {currentBlog.author.name?.charAt(0)?.toUpperCase() || ''}
            </span>
          </div>
        )
      ) : (
        <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center mr-4 border-2 border-white shadow-md">
          <span className="text-xl font-semibold text-gray-500">N/A</span>
        </div>
      )}
      
      {/* Blog content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="prose prose-lg max-w-none mb-12 text-gray-700"
      >
        {currentBlog.description.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-6 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </motion.div>
      
      {/* Comments section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <CommentSection 
          blogId={currentBlog._id} 
          comments={currentBlog.comments || []} 
        />
      </motion.div>
    </motion.div>
  );
}

export default BlogDetails;