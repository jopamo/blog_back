const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const BlogPost = require('../models/BlogPost');

describe('Blog Posts API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await BlogPost.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /posts - should return all posts', async () => {
    const response = await request(server).get('/posts');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('GET /posts/:id - should return a post by ID', async () => {
    const post = new BlogPost({
      title: 'Test Post',
      body: 'This is a test post',
      author: 'Tester',
    });
    await post.save();
    const response = await request(server).get(`/posts/${post._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', post._id.toString());
  });

  test('POST /posts - should create a new post', async () => {
    const postData = {
      title: 'New Post',
      body: 'Content of the new post',
      author: 'Admin',
    };
    const response = await request(server).post('/posts').send(postData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
  });

  test('PUT /posts/:id - should update a post', async () => {
    const post = new BlogPost({
      title: 'Old Title',
      body: 'Old content',
      author: 'Author',
    });
    await post.save();

    const updatedData = {
      title: 'Updated Title',
      body: 'Updated content',
      author: 'Author',
    };
    const response = await request(server)
      .put(`/posts/${post._id}`)
      .send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Title');
  });

  test('DELETE /posts/:id - should delete a post', async () => {
    const post = new BlogPost({
      title: 'Post to delete',
      body: 'Content of the post',
      author: 'Admin',
    });
    await post.save();
    const response = await request(server).delete(`/posts/${post._id}`);
    expect(response.status).toBe(204);

    const findDeleted = await BlogPost.findById(post._id);
    expect(findDeleted).toBeNull();
  });
});
