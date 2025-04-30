import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Import fs to check and create directories
import { 
  createBlog, 
  getBlogs, 
  getUserBlogs,
  getBlogById, 
  updateBlog, 
  deleteBlog,
  addComment,
  addReply
} from '../controllers/blogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Resolve __dirname for ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads'); // Use absolute path
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true }); // Create directory if it doesn't exist
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, `blog-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB
});

// Routes
router.post('/', protect, upload.single('image'), createBlog);
router.get('/', getBlogs);
router.get('/user', protect, getUserBlogs);
router.get('/:id', getBlogById);
router.put('/:id', protect, upload.single('image'), updateBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/comments', protect, addComment);
router.post('/:id/comments/:commentId/replies', protect, addReply);

export default router;