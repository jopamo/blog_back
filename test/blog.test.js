import request from 'supertest';
import server from '../server.js'; // Ensure this properly exports your app
import { setupDB, teardownDB, seedBlogPosts } from './testHelpers';

describe('Blogs', () => {
  beforeAll(async () => {
    await setupDB(); // Setup database, e.g., connect, create indexes
    await seedBlogPosts(); // Seed database with initial data
  });

  afterAll(async () => {
    await teardownDB(); // Clean up database, disconnect
  });

  // Test GET route with initially seeded data
  test('/GET blog - it should GET all blogs', async () => {
    const response = await request(server).get('/posts');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0); // assuming seedBlogPosts seeds at least one post
  });

  // Test POST route - Adding a new blog post
  test('/POST blog - it should POST a blog', async () => {
    const blog = {
      title: 'New Test Blog',
      body: 'This is a new blog post for testing',
      author: 'New Tester',
    };
    const postResponse = await request(server).post('/posts').send(blog);
    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toHaveProperty('_id'); // Confirm blog post is created

    // Optionally fetch all posts to confirm increment
    const getResponse = await request(server).get('/posts');
    expect(getResponse.body.length).toBeGreaterThan(0); // Adjust based on seed data + 1 new post
  });

  // Test DELETE route - Assuming seeded data has known IDs
  test('/DELETE blog - it should DELETE a blog post', async () => {
    // Create a new blog post to delete
    const post = await request(server).post('/posts').send({
      title: 'Temporary Post',
      body: 'This post will be deleted.',
      author: 'Temp Author',
    });

    // Delete the newly created blog post
    const deleteResponse = await request(server).delete(
      `/posts/${post.body._id}`
    );
    expect(deleteResponse.status).toBe(204);

    // Optionally confirm deletion
    const getResponse = await request(server).get(`/posts/${post.body._id}`);
    expect(getResponse.status).toBe(404);
  });

  afterAll(async () => {
    await server.close(); // Close the server after tests
  });
});
