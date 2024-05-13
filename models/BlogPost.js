import mongoose from 'mongoose';

// Schema definition for the BlogPost
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'Post body is required'],
  },
  author: {
    type: String,
    required: [true, "Author's name is required"],
    trim: true,
    index: true, // Adds an index on the author field
  },
  date: {
    type: Date,
    default: Date.now,
    index: true, // Adds an index on the date field
  },
});

// Create a model from the schema
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Export the model
export default BlogPost;
