import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import SortMenu from './components/SortMenu';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null);
  const [notif, setNotif] = useState({ text: null, colour: "green" });
  const [sorting, setSorting] = useState('likes');

  const timeNotif = 1500; //length of time in ms notification is displayed

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = [...blogs];
      if (sorting==='likes') {
        sortedBlogs.sort((a, b) => b[sorting] - a[sorting]);
      } else {
        sortedBlogs.sort((a, b) => a[sorting].localeCompare(b[sorting]));
      };
      
      setBlogs(sortedBlogs);
    });
  }, [blogs]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    };
  }, []);

  const blogFormRef = useRef();

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

      setNotif({ text:`${user.name} successfully signed in`, colour:"green" });
      setTimeout(() => {
        setNotif({ ...notif, text: null })
      }, timeNotif);

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setNotif({ text:"Wrong username or password", colour:"red" });
      setTimeout(() => {
        setNotif({ ...notif, text: null })
      }, timeNotif);
      setPassword('');
    };
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
    setNotif({ text:"Successfully signed out", colour:"green" });
    setTimeout(() => {
      setNotif({ ...notif, text: null })
    }, timeNotif);
  };

  const selectSort = (state) => {
    setSorting(state);
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));

      setNotif({ text:`New blog "${returnedBlog.title}" by ${returnedBlog.author} added`, colour:"green" });
      setTimeout(() => {
        setNotif({ ...notif, text: null })
      }, timeNotif);

    } catch (exception) {
      if (exception.response.status === 401) {
        window.localStorage.removeItem('loggedBlogAppUser');
        setUser(null);
      };
      setNotif({ text:'Failed to add blog', colour:'red' });
      setTimeout(() => {
        setNotif({ ...notif, text: null })
      }, timeNotif);
    };
  };

  const updateBlog = async (blogObject) => {
    console.log(blogObject);
    try {
      const newBlog = { ...blogObject, user: blogObject.user.id };
      const returnedBlog = await blogService.update(newBlog);
      returnedBlog.user = blogObject.user
      setBlogs(blogs.map(blog => blog.id === blogObject.id ? returnedBlog : blog));
    } catch (exception) {
      setNotif({ text:'This blog has already been deleted from server', colour:'red' });
      setTimeout(() => {
        setNotif({ ...notif, text: null })
      }, timeNotif);
    };
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to Blog application</h2>
        <Notification text={notif.text} colour={notif.colour} />
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
      <Notification text={notif.text} colour={notif.colour}/>
      <p>
        {user.name} is signed in. <button onClick={handleLogout}>Log out</button>
      </p>
      <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      
      <br />
      <div>
        <SortMenu onSelect={selectSort} />
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
        )}
      </div>
      
    </div>
  );
};

export default App;
