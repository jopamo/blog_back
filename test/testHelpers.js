const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost'); // Adjust path as necessary

const setupDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
};

const teardownDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

const seedBlogPosts = async () => {
  await BlogPost.deleteMany({});
  const blogPost = new BlogPost({
    title: 'Test Post',
    body: 'This is a test blog post',
    author: 'Tester',
  });
  await blogPost.save();
};

module.exports = {
  setupDB,
  teardownDB,
  seedBlogPosts,
};
