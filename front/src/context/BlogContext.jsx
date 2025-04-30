import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const BlogContext = createContext();

export const useBlog = () => useContext(BlogContext);

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BACKEND_PATH = import.meta.env.VITE_BACKEND_PATH || 'http://localhost:5000';

  useEffect(() => {
    // Fetch initial blogs
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/blogs');
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();

    // Set up WebSocket connection
    // const socket = new WebSocket('ws://localhost:5000');
    const socket = new WebSocket(`ws://${BACKEND_PATH.replace('http://', '')}`);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'NEW_POST') {
        setBlogs((prevBlogs) => [message.payload, ...prevBlogs]);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  // Memoized fetch functions
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/blogs');
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      if (!toast.isActive('fetchBlogsError')) {
        toast.error('Failed to fetch blogs', { id: 'fetchBlogsError' });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/blogs/user');
      setUserBlogs(data || []);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      toast.error('Failed to fetch your blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBlogById = useCallback(async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/blogs/${id}`);
      setCurrentBlog(prev => {
        if (!prev || prev._id !== data._id) {
          return data;
        }
        return prev;
      });
      return data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBlog = useCallback(async (blogData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('description', blogData.description);
      formData.append('image', blogData.image);

      const { data } = await axios.post('/api/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Blog created successfully!');
      navigate('/dashboard');
      return data;
    } catch (error) {
      console.error('Error creating blog:', error);
      const message = error.response?.data?.message || 'Failed to create blog';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const updateBlog = useCallback(async (id, blogData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('description', blogData.description);
      if (blogData.image) {
        formData.append('image', blogData.image);
      }

      const { data } = await axios.put(`/api/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the global state with the updated blog
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog._id === id ? data : blog))
      );
      setUserBlogs((prevUserBlogs) =>
        prevUserBlogs.map((blog) => (blog._id === id ? data : blog))
      );
      setCurrentBlog((prevCurrentBlog) =>
        prevCurrentBlog && prevCurrentBlog._id === id ? data : prevCurrentBlog
      );

      toast.success('Blog updated successfully!');
      navigate('/dashboard');
      return data;
    } catch (error) {
      console.error('Error updating blog:', error);
      const message = error.response?.data?.message || 'Failed to update blog';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const deleteBlog = useCallback(async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/blogs/${id}`);
      setUserBlogs(prev => prev.filter(blog => blog._id !== id));
      toast.success('Blog deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting blog:', error);
      const message = error.response?.data?.message || 'Failed to delete blog';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (blogId, text) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/blogs/${blogId}/comments`, { text });
      
      setCurrentBlog(prevBlog => {
        if (!prevBlog || prevBlog._id !== blogId) return prevBlog;
        const updatedComments = [...(prevBlog.comments || []), data];
        return { ...prevBlog, comments: updatedComments };
      });
      
      toast.success('Comment added successfully!');
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      const message = error.response?.data?.message || 'Failed to add comment';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addReply = useCallback(async (blogId, commentId, text) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/blogs/${blogId}/comments/${commentId}/replies`, { text });
      
      setCurrentBlog(prevBlog => {
        if (!prevBlog || prevBlog._id !== blogId) return prevBlog;
        const updatedComments = prevBlog.comments?.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), data]
            };
          }
          return comment;
        }) || [];
        return { ...prevBlog, comments: updatedComments };
      });
      
      toast.success('Reply added successfully!');
      return data;
    } catch (error) {
      console.error('Error adding reply:', error);
      const message = error.response?.data?.message || 'Failed to add reply';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    blogs,
    userBlogs,
    currentBlog,
    loading,
    fetchBlogs,
    fetchUserBlogs,
    fetchBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    addComment,
    addReply
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}