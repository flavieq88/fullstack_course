import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import SortMenu from './components/SortMenu';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/users';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [user, setUser] = useState(null);
  const [notif, setNotif] = useState({ text: null, color: 'green' });
  const [sorting, setSorting] = useState('likes');

  const timeNotif = 1500; //length of time in ms notification is displayed

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = [...blogs];
      sortedBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
    });
  }, [user]);


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
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

      setNotif({ text:`${user.name} successfully signed in`, color:'green' });
      setTimeout(() => {
        setNotif({ ...notif, text: null });
      }, timeNotif);

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setNotif({ text:'Wrong username or password', color:'red' });
      setTimeout(() => {
        setNotif({ ...notif, text: null });
      }, timeNotif);
      setUsername('');
      setPassword('');
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      await userService.signup({
        username: newUsername,
        name: newName,
        password: newPassword
      });

      const user = await loginService.login({
        username: newUsername,
        password: newPassword,
      });

      blogService.setToken(user.token);
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      );

      setNotif({ text:`${user.name} successfully signed in`, color:'green' });
      setTimeout(() => {
        setNotif({ ...notif, text: null });
      }, timeNotif);

      setUser(user);
      setNewUsername('');
      setNewPassword('');
      setNewName('');

    } catch (exception) {
      if (exception.response.data.error.includes('unique')) {
        setNotif({ text: 'Username already taken', color:'red' });
      }
      else {
        setNotif({ text: exception.response.data.error, color:'red' });
      };
      setTimeout(() => {
        setNotif({ ...notif, text: null });
      }, timeNotif);
      setNewUsername('');
      setNewPassword('');
      setNewName('');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
    setNotif({ text:'Successfully signed out', color:'green' });
    setTimeout(() => {
      setNotif({ ...notif, text: null });
    }, timeNotif);
  };

  const selectSort = (state) => {
    setSorting(state);
    const sortedBlogs = [...blogs];
    if (state==='likes') {
      sortedBlogs.sort((a, b) => b[state] - a[state]);
    } else {
      sortedBlogs.sort((a, b) => a[state].localeCompare(b[state]));
    }

    setBlogs(sortedBlogs);
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);
      const sortedBlogs = blogs.concat({ ...returnedBlog, user: user });
      if (sorting==='likes') {
        sortedBlogs.sort((a, b) => b[sorting] - a[sorting]);
      } else {
        sortedBlogs.sort((a, b) => a[sorting].localeCompare(b[sorting]));
      }

      setBlogs(sortedBlogs);

      setNotif({ text:`New blog "${returnedBlog.title}" by ${returnedBlog.author} added`, color:'green' });
      setTimeout(() => {
        setNotif({ ...notif, text: null });
      }, timeNotif);

    } catch (exception) {
      if (exception.response.status === 401) {
        window.localStorage.removeItem('loggedBlogAppUser');
        setUser(null);
      }
      setNotif({ text:'Failed to add blog', color:'red' });
      setTimeout(() => {
        setNotif({ ...notif, text: null });
      }, timeNotif);
    }
  };

  const updateBlog = async (blogObject) => {
    try {
      const newBlog = { ...blogObject, user: blogObject.user.id };
      const returnedBlog = await blogService.update(newBlog);
      returnedBlog.user = blogObject.user;
      const newBlogs = blogs.map(blog => blog.id === blogObject.id ? returnedBlog : blog);
      if (sorting==='likes') {
        newBlogs.sort((a, b) => b[sorting] - a[sorting]);
      }
      setBlogs(newBlogs);
    } catch (exception) {
      setBlogs(blogs.filter(blog => blog.id !== blogObject.id));
      setNotif({ text:'This blog has already been deleted from server', color:'red' });
      setTimeout(() => {
        setNotif({ ...notif, text: null });
      }, timeNotif);
    }
  };

  const handleDeleteBlog = async (blogObject) => {
    try {
      await blogService.deleteBlog(blogObject.id);
      setBlogs(blogs.filter(blog => blog.id !== blogObject.id));
      setNotif({ text:`Deleted "${blogObject.title}" by ${blogObject.author}`, color:'green' });
      setTimeout(() => {
        setNotif({ ...notif, text: null });
      }, timeNotif);
    } catch (exception) {
      if (exception.response.status === 401) {
        window.localStorage.removeItem('loggedBlogAppUser');
        setUser(null);
      }
      setNotif({ text: 'failed to delete blog', color:'red' });
      setTimeout(() => {
        setNotif({ ...notif, text: null });
      }, timeNotif);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to Blog list</h2>
        <Notification text={notif.text} color={notif.color} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
        <br />
        <SignupForm
          username={newUsername}
          password={newPassword}
          name={newName}
          handleUsernameChange={({ target }) => setNewUsername(target.value)}
          handlePasswordChange={({ target }) => setNewPassword(target.value)}
          handleNameChange={({ target }) => setNewName(target.value)}
          handleSubmit={handleSignup}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification text={notif.text} color={notif.color}/>
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
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} handleDelete={handleDeleteBlog} user={user} />
        )}
      </div>
    </div>
  );
};

export default App;
