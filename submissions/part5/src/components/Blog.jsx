import { useState } from 'react';

const Blog = ({ blog, updateBlog, handleDelete, user }) => {
  const [extended, setExtended] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginBottom: 5,
    background: extended ? 'lightgrey' : 'white'
  };

  const hiddenBlogStyle = {
    display: extended ? '' : 'none'
  };

  const label = extended ? 'Hide' : 'View';

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

  const remove = (blog) => {
    if (window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)) {
      handleDelete(blog);
    }
  };

  return (
    <div style={blogStyle} className='blog'>
      {blog.title}, by {blog.author} <button onClick={toggleExtended}>{label}</button> <br />
      <div style={hiddenBlogStyle} className='extendedInfo'>
        <a href={blog.url}>{blog.url}</a> <br />
        {blog.likes} like{blog.likes!==1 && 's'} <button onClick={() => handleLike(blog)}>Like</button><br />
        Blog added by user {blog.user.username} <br />
        {(blog.user.username===user.username) && <button onClick={() => remove(blog)}>Delete blog</button>}
      </div>
    </div>
  );
};

export default Blog;
