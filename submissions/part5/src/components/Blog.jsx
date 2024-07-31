import { useState } from 'react';

const Blog = ({ blog, updateBlog }) => {
  const [extended, setExtended] = useState(false);

  const closedBlogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginBottom: 5
  };

  const openBlogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginBottom: 5,
    background: 'lightgrey'
  };

  const toggleExtended = () => {
    setExtended(!extended);
  };

  const handleLike = (blog) => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
    };
    updateBlog(newBlog);
  };

  if (!extended) {
    return (
      <div style={closedBlogStyle}>
        {blog.title}, by {blog.author} <button onClick={toggleExtended}>View</button>
      </div>  
    );
  };

  return (
    <div style={openBlogStyle}>
      {blog.title}, by {blog.author} <br />
      <a href={blog.url} target='_blank'>{blog.url}</a> <br />
      {blog.likes} like{blog.likes!==1 && 's'} <button onClick={() => handleLike(blog)}>Like</button><br />
      Blog added by user {blog.user.username} <br />
      <button onClick={toggleExtended}>Hide</button>
    </div> 
  )
};

export default Blog;
