import { SingleBlog } from "./BlogList";

const User = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.username}</h2>
      <h3>Added blogs:</h3>
      <div>
        {user.blogs.length !== 0
          ? user.blogs.map((blog) => <SingleBlog key={blog.id} blog={blog} />)
          : "No blogs added yet"}
      </div>
    </div>
  );
};

export default User;
