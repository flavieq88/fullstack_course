const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body;

  try {
    const user = request.user;

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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(204).json({ error: 'blog already deleted from server' });
    };

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

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      body,
      { new: true, runValidators: true, context: 'query' }
    );
    if (!updatedBlog) {
      return response.status(400).send({ error: 'blog not found' });
    }
    response.json(updatedBlog);

  } catch(exception) {
    next(exception);
  };
});

module.exports = blogsRouter;
