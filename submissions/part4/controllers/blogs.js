const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    };
    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    });

    const result = await blog.save();
    user.blogs = user.blogs.concat(result._id);
    await user.save();

    response.status(201).json(result);

  } catch(exception) {
    next(exception);
  };  
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    // first get the token
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) { //no token = invalid action
      return response.status(401).json({ error: 'token invalid' })
    };

    const user = await User.findById(decodedToken.id);
    
    const blog = await Blog.findById(request.params.id);
    
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).json({ error: 'invalid user for this action' });
    };
  } catch(exception) {
    next(exception);
  };
});

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body;

    updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      body,
      { new: true, runValidators: true, context: 'query' }
    );
    response.json(updatedBlog);

  } catch(exception) {
    next(exception);
  };
});

module.exports = blogsRouter;
