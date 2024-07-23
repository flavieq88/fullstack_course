const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  };
});


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
})

test('id field is named id instead of _id', async () => {
  const response = await api.get('/api/blogs');
  response.body.forEach(object => {
    assert(!object._id);
    assert(object.id);
  });
})

test('new blog can be created', async () => {
  const newBlog = {
    title: "Testing that a new blog can be added!",
    author: "Anonymous",
    url: "https://wikipedia.org",
    likes: 42564264236346
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const contents = blogsAtEnd.map(r => r.title);
  assert(contents.includes("Testing that a new blog can be added!"));
})

test('blog with no likes field will default to 0', async () => {
  const newBlog = {
    title: "Testing that no likes results in 0!",
    author: "Anonymous",
    url: "https://wikipedia.org",
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const savedBlog = response.body;
  assert.strictEqual(savedBlog.likes, 0);
})

test('blog with no title is not added', async () => {
  const newBlog = {
    author: "Anonymous",
    url: "https://wikipedia.org",
    likes: 235
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
})

test('blog with no url is not added', async () => {
  const newBlog = {
    title: "This blog has no url!",
    author: "Anonymous"
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
})

after(async () => {
  await mongoose.connection.close();
});
