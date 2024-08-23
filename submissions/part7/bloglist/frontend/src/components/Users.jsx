import { Link } from "react-router-dom";

const Users = ({ users }) => {
  const linkStyle = {
    color: "black",
    textDecoration: "none",
    borderBottom: "1px dotted black",
  };

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`} style={linkStyle}>
                  {user.username}
                </Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
