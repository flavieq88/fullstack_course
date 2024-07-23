const { test, after, beforeEach, describe } = require('node:test');
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

describe('when there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('id field is named id instead of _id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(object => {
      assert(!object._id);
      assert(object.id);
    });
  });

  describe('addition of a new blog', () => {
    test('new blog can be created', async () => {
      const newBlog = {
        title: "Testing that a new blog can be added!",
        author: "Anonymous",
        url: "https://wikipedia.org",
        likes: 42564264236346
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const contents = blogsAtEnd.map(r => r.title);
      assert(contents.includes('Testing that a new blog can be added!'));
    });

    test('blog with no likes field will default to 0', async () => {
      const newBlog = {
        title: "Testing that no likes results in 0!",
        author: "Anonymous",
        url: "https://wikipedia.org",
      };

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const savedBlog = response.body;
      assert.strictEqual(savedBlog.likes, 0);
    });

    test('blog with no title is not added', async () => {
      const newBlog = {
        author: "Anonymous",
        url: "https://wikipedia.org",
        likes: 235
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test('blog with no url is not added', async () => {
      const newBlog = {
        title: "This blog has no url!",
        author: "Anonymous"
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status 204 if valid id', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    });
  });

  describe('updating a blog', () => {
    test('succeeds with status 200 if valid id', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
