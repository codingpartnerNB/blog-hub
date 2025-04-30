import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';
import { useState, useEffect } from 'react';

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [visiblePages, setVisiblePages] = useState([]);
  
  useEffect(() => {
    if (totalPages <= 1) return;
    
    let pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're at the start or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Always show first page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
    }
    
    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }
    
    setVisiblePages(pages);
  }, [totalPages, currentPage]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-10">
      <nav className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed opacity-70'
              : 'text-gray-700 hover:bg-gradient-to-r from-blue-50 to-purple-50 hover:text-blue-600'
          }`}
          aria-label="Previous page"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>
        
        {/* Page Numbers */}
        {visiblePages.map((item, index) => {
          if (item === 'ellipsis-start' || item === 'ellipsis-end') {
            return (
              <span key={index} className="px-2 py-1 text-gray-400 flex items-center">
                <FiMoreHorizontal className="h-4 w-4" />
              </span>
            );
          }
          
          return (
            <button
              key={index}
              onClick={() => onPageChange(item)}
              className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-200 ${
                currentPage === item
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
              aria-label={`Page ${item}`}
              aria-current={currentPage === item ? 'page' : undefined}
            >
              {item}
            </button>
          );
        })}
        
        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed opacity-70'
              : 'text-gray-700 hover:bg-gradient-to-r from-blue-50 to-purple-50 hover:text-blue-600'
          }`}
          aria-label="Next page"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;