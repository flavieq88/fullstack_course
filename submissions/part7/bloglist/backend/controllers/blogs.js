const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { text: 1, user: 1, username: 1 });
  response.json(blogs);
});

blogsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    const body = request.body;

    try {
      const user = request.user;

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        comments: [],
        user: user.id,
      });

      const result = await blog.save();
      user.blogs = user.blogs.concat(result._id);
      await user.save();

      response.status(201).json(result);
    } catch (exception) {
      next(exception);
    }
  }
);

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user;

      const blog = await Blog.findById(request.params.id);

      if (!blog) {
        return response
          .status(204)
          .json({ error: "blog already deleted from server" });
      }

      if (blog.user.toString() === user.id.toString()) {
        const comments = blog.comments;
        await Blog.findByIdAndDelete(request.params.id);
        comments.forEach(async (comment) => {
          await Comment.findByIdAndDelete(comment);
        });
        response.status(204).end();
      } else {
        response.status(401).json({ error: "invalid user for this action" });
      }
    } catch (exception) {
      next(exception);
    }
  }
);

blogsRouter.put("/:id", async (request, response, next) => {
  try {
    const body = request.body;

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
      new: true,
      runValidators: true,
      context: "query",
    });
    if (!updatedBlog) {
      return response.status(400).send({ error: "blog not found" });
    }
    response.json(updatedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post(
  "/:id/comments",
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const id = request.params.id;
      const text = request.body.text;
      const user = request.user;
      const blog = await Blog.findById(id);

      if (!blog) {
        return response.status(400).send({ error: "blog not found" });
      }

      const comment = new Comment({
        blog: id,
        text,
        user: user.id,
        username: user.username,
      });

      const savedComment = await comment.save();

      blog.comments = [...blog.comments].concat(savedComment.id);
      await blog.save();

      response.status(201).json(savedComment);
    } catch (exception) {
      next(exception);
    }
  }
);

module.exports = blogsRouter;
