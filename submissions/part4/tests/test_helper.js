const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: "The Raleigh Grand Prix Series",
    author: "Sheldon Brown",
    url: "https://www.sheldonbrown.com/retroraleighs/grand-prix.html",
    likes: 2
  },
  {
    title: "Chef John's Peach Tartlets",
    author: "John Mitzewich",
    url: "https://www.allrecipes.com/recipe/237237/chef-johns-peach-tartlets/",
    likes: 14
  }
];

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
};