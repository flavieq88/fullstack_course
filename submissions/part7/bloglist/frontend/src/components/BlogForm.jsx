import { useField } from "../hooks";
import { addBlog } from "../reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";

import Togglable from "./Togglable";

const BlogForm = () => {
  const [title, titleActions] = useField("text", "Title");
  const [author, authorActions] = useField("text", "Author");
  const [url, urlActions] = useField("text", "URL");

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const blogFormRef = useRef();

  const createBlog = (event) => {
    event.preventDefault();
    blogFormRef.current.toggleVisibility();

    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
    };

    dispatch(addBlog(newBlog, user));

    titleActions.reset();
    authorActions.reset();
    urlActions.reset();
  };

  return (
    <div>
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <h3>Create a new blog:</h3>
        <form onSubmit={createBlog}>
          <div>
            <input {...title} />
          </div>
          <div>
            <input {...author} />
          </div>
          <div>
            <input {...url} />
          </div>
          <button type="submit" className="submitButton">
            Post
          </button>
        </form>
      </Togglable>
    </div>
  );
};

export default BlogForm;
