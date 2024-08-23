import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { notify } from "./notifReducer";
import { clearUser } from "./userReducer";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const id = action.payload.id;
      return state.map((blog) => (blog.id !== id ? blog : action.payload));
    },
    deleteBlog(state, action) {
      const id = action.payload.id;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, deleteBlog } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const changedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
      comments: blog.comments.map((comment) => comment.id),
    };
    try {
      const response = await blogService.update(changedBlog);
      dispatch(
        updateBlog({ ...response, user: blog.user, comments: blog.comments }),
      );
      dispatch(
        notify(
          {
            message: `You liked ${changedBlog.title}`,
            color: "green",
          },
          2,
        ),
      );
    } catch (exception) {
      dispatch(
        notify(
          {
            message: "This blog has already been deleted from server",
            color: "red",
          },
          2,
        ),
      );
    }
  };
};

export const commentBlog = (text, blog) => {
  return async (dispatch) => {
    try {
      const response = await blogService.postComment(text, blog.id);
      dispatch(
        updateBlog({ ...blog, comments: blog.comments.concat(response) }),
      );
      dispatch(
        notify(
          {
            message: `You commented ${text}`,
            color: "green",
          },
          2,
        ),
      );
    } catch (exception) {
      if (exception.response.status === 401) {
        window.localStorage.removeItem("loggedBlogAppUser");
        dispatch(clearUser());
        dispatch(
          notify(
            {
              message: "Failed to add blog, session expired",
              color: "red",
            },
            2,
          ),
        );
      } else {
        dispatch(
          notify(
            {
              message: "Failed to add comment",
              color: "red",
            },
            2,
          ),
        );
      }
    }
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(blog.id);
      dispatch(deleteBlog(blog));

      dispatch(
        notify(
          {
            message: `Deleted "${blog.title}" by ${blog.author}`,
            color: "green",
          },
          2,
        ),
      );
    } catch (exception) {
      if (exception.response.status === 401) {
        window.localStorage.removeItem("loggedBlogAppUser");
        dispatch(clearUser());
        dispatch(
          notify(
            {
              message: "Failed to delete blog, session expired",
              color: "red",
            },
            2,
          ),
        );
      } else {
        dispatch(
          notify(
            {
              message: "Failed to delete blog",
              color: "red",
            },
            2,
          ),
        );
      }
    }
  };
};

export const addBlog = (blog, user) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog);
      dispatch(appendBlog({ ...newBlog, user }));
      dispatch(
        notify(
          {
            message: `New blog "${newBlog.title}" by ${newBlog.author} added`,
            color: "green",
          },
          2,
        ),
      );
    } catch (exception) {
      if (exception.response.status === 401) {
        window.localStorage.removeItem("loggedBlogAppUser");
        dispatch(clearUser());
        dispatch(
          notify(
            {
              message: "Failed to add blog, session expired",
              color: "red",
            },
            2,
          ),
        );
      } else {
        dispatch(
          notify(
            {
              message: "Missing title, author or URL",
              color: "red",
            },
            2,
          ),
        );
      }
    }
  };
};

export default blogSlice.reducer;
