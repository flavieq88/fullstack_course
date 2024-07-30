import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      blogService.setToken(user.token);
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      );

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      console.log('Wrong username or password');
      setPassword('');
    };
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  const addBlog = async (event) => {
    event.preventDefault();

    try {
      const blogObject = {
        title,
        author,
        url
      };

      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setTitle('');
      setAuthor('');
      setUrl('');

    } catch (exception) {
      console.log(exception.message);
      setTitle('');
      setAuthor('');
      setUrl('');
    }
  };


  if (user === null) {
    return (
      <div>
        <h2>Log in to Blog application</h2>
        <form onSubmit={handleLogin}>
          <div>
            Username:
              <input 
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
              />
          </div>
          <div>
            Password:
              <input 
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
              />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };

  return (
    <div>
      <h2>Blogs</h2>
      <p>
        {user.name} is signed in.
        <button onClick={handleLogout}>Log out</button>
      </p>
      <h3>Create a new blog:</h3>
      <form onSubmit={addBlog}>
          <div>
            Title:
              <input 
              type='text'
              value={title}
              name='Title'
              onChange={({ target }) => setTitle(target.value)}
              />
          </div>
          <div>
            Author:
              <input 
              type='text'
              value={author}
              name='Author'
              onChange={({ target }) => setAuthor(target.value)}
              />
          </div>
          <div>
            URL:
              <input 
              type='text'
              value={url}
              name='URL'
              onChange={({ target }) => setUrl(target.value)}
              />
          </div>
          <button type="submit">Create</button>
        </form>
      
      <br />
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
      
    </div>
  );
};

export default App;
