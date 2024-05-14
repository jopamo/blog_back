const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

const { faker } = require('@faker-js/faker');

const generateFakePosts = async (numPosts) => {
  await mongoose.connect(process.env.MONGODB_URI);

  await BlogPost.deleteMany({});

  const posts = [];
  for (let i = 0; i < numPosts; i++) {
    posts.push({
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(5),
      author: faker.person.fullName(),
      date: faker.date.past(),
    });
  }

  await BlogPost.insertMany(posts);
  console.log(`Successfully inserted ${numPosts} fake blog posts!`);
  await mongoose.connection.close();
};

generateFakePosts(500).catch(console.error);
