import { useSelector } from "react-redux";

import SortMenu from "./SortMenu";

import { Link } from "react-router-dom";

export const SingleBlog = ({ blog }) => {
  const blogStyle = {
    border: "solid",
    borderWidth: 1,
    borderColor: "gray",
    margin: "auto",
    marginBottom: 5,
    background: "white",
    textDecoration: "none",
    width: "95%",
    borderRadius: 12,
  };
  return (
    <div style={blogStyle} className="singleBlog">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title}, by {blog.author}
      </Link>
    </div>
  );
};

const BlogList = () => {
  const blogs = useSelector((state) => {
    const list = [...state.blogs];
    if (state.filter === "likes") {
      return list.sort((a, b) => b[state.filter] - a[state.filter]);
    } else {
      return list.sort((a, b) =>
        a[state.filter].localeCompare(b[state.filter]),
      );
    }
  });

  return (
    <div>
      <h1>Blogs</h1>
      <h2>Browse all blogs</h2>
      <SortMenu />
      {blogs.map((blog) => (
        <SingleBlog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
