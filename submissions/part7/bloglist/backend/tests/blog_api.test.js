const { test, after, before, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

let token = '';

before(async () => {
  //must log in and get a token before starting tests
  await User.deleteMany({});

  const user = new User({
    username: 'root',
    name: 'superuser',
    passwordHash: await bcrypt.hash('123456789', 10)
  });

  await user.save();

  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: '123456789' });

  token = response.body.token;
});

describe('when there is initially some blogs saved', () => {
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
  });

  test('id field is named id instead of _id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(object => {
      assert(!object._id);
      assert(object.id);
    });
  });

  describe('addition of a new blog', () => {
    test('new blog can be created with valid token', async () => {
      const newBlog = {
        title: "Testing that a new blog can be added!",
        author: "Anonymous",
        url: "https://wikipedia.org",
        likes: 42564264236346
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test('fails with status code 401 if missing token', async () => {
      const newBlog = {
        title: "Testing that a new blog can be added!",
        author: "Anonymous",
        url: "https://wikipedia.org",
        likes: 42564264236346
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status 204 if valid id', async () => {
      const blogToDelete = {
        title: 'this blgo will be deleted shortly after',
        url: 'dummy url'
      };

      const response = await api
        .post('/api/blogs')
        .send(blogToDelete)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const id = response.body.id;

      const blogsAtStart = await helper.blogsInDb();

      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    });

    test('fails with status 401 if token missing', async () => {
      const blogToDelete = {
        title: 'this blgo will be deleted shortly after',
        url: 'dummy url'
      };

      const response = await api
        .post('/api/blogs')
        .send(blogToDelete)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const id = response.body.id;

      const blogsAtStart = await helper.blogsInDb();

      await api
        .delete(`/api/blogs/${id}`)
        .expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });
  });

  describe('updating a blog', () => {
    test('succeeds with status 200 if valid id', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const finalBlog = blogsAtEnd[0];

      assert.strictEqual(blogToUpdate.likes + 1, finalBlog.likes);
    });

    test('fails with status 401 if non existing id', async () => {
      const newBlog = {
        title: 'hello this is a new blog',
        author: 'John Doe',
        url: 'https://wikipedia.org'
      };

      const badId = await helper.nonExistingId();

      await api
        .put(`/api/blogs/${badId}`)
        .send(newBlog)
        .expect(400);
    });
  });
});

describe('when there is initially one user saved in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const user = new User({
      username: 'root',
      name: 'superuser',
      passwordHash: await bcrypt.hash('123456789', 10)
    });

    await user.save();
  });

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all users are returned', async () => {
    const response = await api.get('/api/users');
    assert.strictEqual(response.body.length, 1);
  });

  describe('addition of a new user', () => {
    test('saving a new valid username works', async () => {
      const usersAtStart = await helper.usersInDb();

      const user = {
        username: 'flavieq',
        name: 'Flavie Qin',
        password: 'asdghersdfg'
      };

      await api
        .post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();

      assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length);

      const usernames = usersAtEnd.map(r => r.username);
      assert(usernames.includes('flavieq'));
    });

    test('fails with non unique username', async () => {
      const usersAtStart = await helper.usersInDb();

      const user = {
        username: 'root',
        name: 'Flavie Qin',
        password: 'asdghersdfg'
      };

      await api
        .post('/api/users')
        .send(user)
        .expect(400);

      const usersAtEnd = await helper.usersInDb();

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('fails with no given username', async () => {
      const usersAtStart = await helper.usersInDb();

      const user = {
        name: 'Flavie Qin',
        password: 'asdghersdfg'
      };

      await api
        .post('/api/users')
        .send(user)
        .expect(400);

      const usersAtEnd = await helper.usersInDb();

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('fails with username too short', async () => {
      const usersAtStart = await helper.usersInDb();

      const user = {
        username: '12',
        name: 'Flavie Qin',
        password: 'asdghersdfg'
      };

      await api
        .post('/api/users')
        .send(user)
        .expect(400);

      const usersAtEnd = await helper.usersInDb();

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('fails with password missing', async () => {
      const usersAtStart = await helper.usersInDb();

      const user = {
        username: 'flavieq',
        name: 'Flavie Qin'
      };

      await api
        .post('/api/users')
        .send(user)
        .expect(400);

      const usersAtEnd = await helper.usersInDb();

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('fails with password too short', async () => {
      const usersAtStart = await helper.usersInDb();

      const user = {
        username: 'flavieq',
        name: 'Flavie Qin',
        password: 'qw'
      };

      await api
        .post('/api/users')
        .send(user)
        .expect(400);

      const usersAtEnd = await helper.usersInDb();

      assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });
  });

});

after(async () => {
  await mongoose.connection.close();
});
