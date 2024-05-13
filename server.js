import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import blogRoutes from './routes/blogRoutes.js';
import BlogPost from './models/BlogPost.js';

// Create an Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the connection string from the .env file
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection established'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a simple route to check server status
app.get('/', (req, res) => {
  res.send('Hello World! The server is running.');
});

// Use blog routes for all requests to /posts
app.use('/posts', blogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Example DELETE route handler in server.js
app.delete('/posts/:id', async (req, res) => {
  try {
    const result = await BlogPost.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send(); // No content found to delete
    }
    return res.status(204).send(); // Successfully deleted
  } catch (error) {
    return res.status(500).send();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app for use in other modules
export default app;
