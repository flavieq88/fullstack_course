import { useEffect, useState } from "react";

import { initializeBlogs } from "./reducers/blogReducer";
import { setUser } from "./reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";

import { Routes, Route, useMatch } from "react-router-dom";

import blogService from "./services/blogs";
import userService from "./services/users";

import BlogList from "./components/BlogList";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Users from "./components/Users";
import User from "./components/User";
import Home from "./components/Home";
import NavBar from "./components/NavBar";

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blogs);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    dispatch(initializeBlogs());
    userService.getUsers().then((response) => setUsers(response));
  }, [user]);

  const userMatch = useMatch("/users/:id");
  const individualUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null;

  const blogMatch = useMatch("/blogs/:id");
  const individualBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null;

  if (!user) {
    return (
      <div>
        <div className="headerLogin">
          <strong>BlogCatalog</strong>
        </div>
        <Notification />
        <h1>Log in to BlogCatalog</h1>
        <LoginForm />
        <br />
        <SignupForm />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<Blog blog={individualBlog} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/users/:id" element={<User user={individualUser} />} />
      </Routes>
    </div>
  );
};

export default App;
