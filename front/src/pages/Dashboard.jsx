import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiCalendar, FiGrid, FiList, FiUser, FiBook } from 'react-icons/fi';
import { motion } from 'framer-motion';

function Dashboard() {
  const { userBlogs, fetchUserBlogs, deleteBlog, loading } = useBlog();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, blogId: null, blogTitle: '' });

  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

  const handleDeleteClick = (blogId, blogTitle) => {
    setDeleteModal({ isOpen: true, blogId, blogTitle });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBlog(deleteModal.blogId);
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, blogId: null, blogTitle: '' });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <motion.div
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
   
      {/* User Profile Header */}
      <motion.div
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 lg:p-6 shadow-sm mt-4"
      >
        {/* Profile section with image and text */}
        <div className="flex items-center flex-grow min-w-0 w-full sm:w-auto">
          {/* Profile image container */}
          <div className="flex-shrink-0 mr-4">
            {user?.profileImage ? (
              <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img 
                  src={`${import.meta.env.VITE_BACKEND_PATH}${user.profileImage}`} 
                  alt={user.name} 
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="h-full w-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                        <span class="text-xl font-semibold text-blue-600">
                          ${user.name?.charAt(0)?.toUpperCase() || ''}
                        </span>
                      </div>
                    `;
                  }}
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-md">
                <FiUser className="h-8 w-8 text-blue-600" />
              </div>
            )}
          </div>

          {/* Welcome text - now properly wraps */}
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 break-words">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600 break-words">
              Manage your blog posts and content
            </p>
          </div>
        </div>

        {/* New Blog Post button - stays aligned right */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-shrink-0 w-full sm:w-auto"
        >
          <Link 
            to="/blogs/create" 
            className="btn-gradient flex p-3 rounded-lg items-center justify-center sm:justify-start group hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
          >
            <FiPlus className="mr-2 group-hover:rotate-90 transition-transform" />
            New Blog Post
          </Link>
        </motion.div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiBook className="mr-3 text-blue-500" />
            Your Blog Posts ({userBlogs?.length || 0})
          </h2>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              aria-label="Grid view"
            >
              <FiGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              aria-label="List view"
            >
              <FiList className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Blog Posts */}
        {userBlogs?.length > 0 ? (
          viewMode === 'grid' ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {userBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-end space-x-2">
                        <Link
                          to={`/blogs/${blog._id}`}
                          className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-blue-600 transition-colors duration-200"
                          title="View"
                        >
                          <FiEye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/blogs/edit/${blog._id}`}
                          className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-blue-600 transition-colors duration-200"
                          title="Edit"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(blog._id, blog.title)}
                          className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-white hover:text-red-600 transition-colors duration-200"
                          title="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{blog.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FiCalendar className="mr-2 text-blue-500" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {blog.description}
                    </p>
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                    >
                      Read more →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blog Post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userBlogs.map((blog) => (
                      <motion.tr
                        key={blog._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                              <img
                                className="h-10 w-10 object-cover"
                                src={blog.image}
                                alt={blog.title}
                                loading="lazy"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                {blog.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(blog.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Published
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link
                              to={`/blogs/${blog._id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <FiEye className="h-5 w-5" />
                            </Link>
                            <Link
                              to={`/blogs/edit/${blog._id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FiEdit2 className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(blog._id, blog.title)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="mx-auto h-24 w-24 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-6">
              <FiBook className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No blog posts yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              You haven't created any blog posts yet. Share your first story with the world!
            </p>
            <Link 
              to="/blogs/create" 
              className="btn-gradient inline-flex items-center group p-3 rounded-lg"
            >
              <FiPlus className="mr-2 group-hover:rotate-90 transition-transform" />
              Create Your First Blog
            </Link>
          </motion.div>
        )}
      </motion.div>

      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        isDeleting={loading}
        title={deleteModal.blogTitle}
      />
    </motion.div>
  );
}

export default Dashboard;


