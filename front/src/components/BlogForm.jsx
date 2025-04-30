import { useState, useRef } from 'react';
import { FiUpload, FiX, FiEdit2, FiImage } from 'react-icons/fi';

function BlogForm({ initialData, onSubmit, isSubmitting }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrors((prevErrors) => ({ ...prevErrors, image: 'Please upload an image file' }));
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prevErrors) => ({ ...prevErrors, image: undefined }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setImagePreview('');
    fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({ title, description, image });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{initialData ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
      
      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Blog Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, title: undefined }));
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter a captivating title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Blog Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, description: undefined }));
            }}
            rows={8}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Share your thoughts, ideas, and stories..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          
          <div 
            onClick={handleImageClick}
            className={`cursor-pointer ${
              imagePreview ? '' : 'border-2 border-dashed border-gray-300 rounded-lg p-6'
            }`}
          >
            {imagePreview ? (
              <div className="relative group">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-sm"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="bg-white p-2 rounded-full text-red-500 hover:bg-red-50 mr-2"
                    title="Remove image"
                  >
                    <FiX size={18} />
                  </button>
                  <button 
                    type="button"
                    className="bg-white p-2 rounded-full text-blue-500 hover:bg-blue-50"
                    title="Change image"
                  >
                    <FiEdit2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 text-gray-400 hover:text-gray-600 transition duration-200">
                <FiImage size={48} />
                <p className="text-sm font-medium">Click to upload an image</p>
                <p className="text-xs">Recommended size: 1200x630 pixels</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-6 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-md hover:shadow-lg ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {initialData ? 'Updating...' : 'Publishing...'}
              </span>
            ) : (
              initialData ? 'Update Post' : 'Publish Post'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BlogForm;