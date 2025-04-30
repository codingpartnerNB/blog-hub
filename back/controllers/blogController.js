import Blog from '../models/Blog.js';
import { uploadImage } from '../utils/cloudinary.js';
import fs from 'fs';

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Blog image is required' });
    }

    // Upload image to cloudinary
    let imageUrl;
    try {
      imageUrl = await uploadImage(req.file.path);
      // Remove file from server
      fs.unlinkSync(req.file.path);
    } catch (error) {
      return res.status(500).json({ message: 'Error uploading image' });
    }

    const blog = await Blog.create({
      title,
      description,
      image: imageUrl,
      author: req.user._id
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate('author', 'name profileImage');
    
    res.json(blogs);
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user blogs
// @route   GET /api/blogs/user
// @access  Private
export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(blogs);
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name profileImage')
      .populate({
        path: 'comments',
        populate: [
          { path: 'user', select: 'name profileImage' },
          { 
            path: 'replies',
            populate: { path: 'user', select: 'name profileImage' }
          }
        ]
      });
    
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update fields
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    
    // If new image is uploaded
    if (req.file) {
      try {
        const imageUrl = await uploadImage(req.file.path);
        blog.image = imageUrl;
        // Remove file from server
        fs.unlinkSync(req.file.path);
      } catch (error) {
        return res.status(500).json({ message: 'Error uploading image' });
      }
    }
    
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog removed' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const comment = {
      user: req.user._id,
      text,
      replies: []
    };
    
    blog.comments.push(comment);
    await blog.save();
    
    // Populate the newly added comment with user details
    const populatedBlog = await Blog.findById(req.params.id)
      .populate('comments.user', 'name profileImage');
    
    const newComment = populatedBlog.comments[populatedBlog.comments.length - 1];
    
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add reply to comment
// @route   POST /api/blogs/:id/comments/:commentId/replies
// @access  Private
export const addReply = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Reply text is required' });
    }
    
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Find the comment
    const comment = blog.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const reply = {
      user: req.user._id,
      text
    };
    
    comment.replies.push(reply);
    await blog.save();
    
    // Populate the newly added reply with user details
    const populatedBlog = await Blog.findById(req.params.id)
      .populate('comments.replies.user', 'name profileImage');
    
    const updatedComment = populatedBlog.comments.id(req.params.commentId);
    const newReply = updatedComment.replies[updatedComment.replies.length - 1];
    
    res.status(201).json(newReply);
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};