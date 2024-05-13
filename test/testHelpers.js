// test/testHelpers.js
import mongoose from 'mongoose';
import BlogPost from '../models/BlogPost'; // Adjust path as necessary

export const setupDB = async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export const teardownDB = async () => {
  // Disconnect and clean up the test database
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const seedBlogPosts = async () => {
  const blogPost = new BlogPost({
    title: 'Test Post',
    body: 'This is a test blog post',
    author: 'Tester',
  });
  await blogPost.save();
};
