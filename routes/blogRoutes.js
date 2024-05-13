import express from 'express';
import BlogPost from '../models/BlogPost.js';
import { check, validationResult } from 'express-validator';

const router = express.Router();

// Validators for different routes
const postValidators = [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('body').not().isEmpty().withMessage('Body is required'),
  check('author').not().isEmpty().withMessage("Author's name is required"),
];

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to retrieve posts', error: error.message });
  }
});

// Get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to retrieve the post', error: error.message });
  }
});

// Create a new blog post
router.post('/', postValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const post = new BlogPost({
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Failed to create a new post', error: error.message });
  }
});

// Update a blog post by ID
router.put('/:id', postValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(updatedPost);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Failed to update the post', error: error.message });
  }
});

// Delete a blog post by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete the post', error: error.message });
  }
});

export default router;
