import { useEffect, useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import { FiPlus, FiSearch, FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';

function Blogs() {
  const { blogs, fetchBlogs, loading } = useBlog();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      await fetchBlogs();
      setIsLoading(false);
    };

    fetchAllBlogs();

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  // Filter blogs based on search term
  const filteredBlogs = Array.isArray(blogs) && blogs.length > 0
    ? blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.author && blog.author.name.toLowerCase().includes(searchTerm.toLowerCase())))
    : [];

  // Get current page blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-10"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Explore Blogs
          </h1>
          <p className="text-gray-600 mt-2 max-w-lg">
            Discover stories, ideas, and expertise from our vibrant community of writers and thinkers.
          </p>
        </motion.div>

        {isAuthenticated && (
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6 md:mt-0"
          >
            <Link 
              to="/blogs/create" 
              className="btn-gradient flex items-center group hover:shadow-lg transition-all duration-300 p-3 rounded-lg"
            >
              <FiPlus className="mr-2 group-hover:rotate-90 transition-transform" />
              Write a Blog
            </Link>
          </motion.div>
        )}
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative mb-10"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search blogs by title, content or author..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
        />
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 opacity-75 animate-ping"></div>
            <div className="relative h-16 w-16 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
              <FiBookOpen className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        // Empty State
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-6">
            <FiBookOpen className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">No blogs yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            The blogosphere is empty. Be the first to share your knowledge and inspire others!
          </p>
          {isAuthenticated && (
            <Link 
              to="/blogs/create" 
              className="btn-gradient inline-flex items-center group"
            >
              <FiPlus className="mr-2 group-hover:rotate-90 transition-transform" />
              Create Your First Blog
            </Link>
          )}
        </motion.div>
      ) : currentBlogs.length > 0 ? (
        // Blog Grid
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {currentBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Pagination
              totalItems={filteredBlogs.length}
              itemsPerPage={blogsPerPage}
              currentPage={currentPage}
              onPageChange={paginate}
            />
          </motion.div>
        </>
      ) : (
        // No Results State
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="mx-auto h-24 w-24 bg-gradient-to-r from-red-50 to-pink-50 rounded-full flex items-center justify-center mb-6">
            <FiSearch className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">No matching blogs found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            We couldn't find any blogs matching "{searchTerm}". Try different keywords or browse all blogs.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="btn-outline"
          >
            Clear Search
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Blogs;