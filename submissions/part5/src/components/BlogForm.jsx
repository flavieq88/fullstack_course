import { useState } from 'react';

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const createBlog = async (event) => {
    event.preventDefault();

    addBlog({
      title,
      author,
      url
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h3>Create a new blog:</h3>
      <form onSubmit={createBlog}>
        <div>
          Title: <input
            type='text'
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
            placeholder='Write title'
          />
        </div>
        <div>
          Author: <input
            type='text'
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='Write author'
          />
        </div>
        <div>
          URL: <input
            type='text'
            value={url}
            name='URL'
            onChange={({ target }) => setUrl(target.value)}
            placeholder='Write URL'
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
