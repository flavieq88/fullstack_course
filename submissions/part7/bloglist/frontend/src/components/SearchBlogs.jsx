import { useDispatch, useSelector } from "react-redux";
import { searchChange, clearSearch } from "../reducers/searchReducer";
import { SingleBlog } from "./BlogList";

const SearchBlog = () => {
  const dispatch = useDispatch();

  const blogs = useSelector((state) => {
    const list =
      state.search === ""
        ? []
        : state.blogs.filter(
            (blog) =>
              blog.title.toLowerCase().includes(state.search.toLowerCase()) ||
              blog.author.toLowerCase().includes(state.search.toLowerCase()),
          );
    return list;
  });

  const search = useSelector((state) => state.search);

  const handleChange = (event) => {
    dispatch(searchChange(event.target.value));
  };

  const buttonStyle = {
    background: "transparent",
    border: "none",
    fontSize: "larger",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div>
      <h2>Search for a blog:</h2>
      <input
        placeholder="Search by title or author"
        onChange={handleChange}
        type="text"
        value={search}
      />
      <button style={buttonStyle} onClick={() => dispatch(clearSearch())}>
        &#10005;
      </button>

      {blogs.map((blog) => (
        <SingleBlog key={blog.id} blog={blog} />
      ))}
      {search !== "" && blogs.length === 0 && <p>No results found...</p>}
    </div>
  );
};

export default SearchBlog;
