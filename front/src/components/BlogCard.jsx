import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiImage } from 'react-icons/fi';
import { useState } from 'react';

function BlogCard({ blog }) {
  const [imageError, setImageError] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return 'Unknown date';
    }
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return 'No description available';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="card group hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-2xl transform hover:-translate-y-1 h-full flex flex-col">
      <div className="relative overflow-hidden h-48 bg-gradient-to-br from-purple-500 to-blue-500">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <FiImage className="text-4xl text-gray-400 dark:text-gray-500" />
          </div>
        ) : (
          <img 
            src={blog.image} 
            alt={blog.title} 
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            loading="lazy"
          />
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white line-clamp-2">
          {blog.title || 'Untitled Blog Post'}
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-4">
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-blue-500" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          
          {blog.author && (
            <div className="flex items-center">
              <FiUser className="mr-2 text-blue-500" />
              <span>{blog.author.name || 'Unknown author'}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 flex-1">
          {truncateDescription(blog.description)}
        </p>
        
        <Link 
          to={`/blogs/${blog._id}`} 
          className="mt-auto cursor-pointer inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-center"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;