import { useField } from "../hooks";
import { useDispatch } from "react-redux";
import { loginUser } from "../reducers/userReducer";

const LoginForm = () => {
  const [username, usernameActions] = useField("text", "Username");
  const [password, passwordActions] = useField("password", "Password");

  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(loginUser(username.value, password.value));

    usernameActions.reset();
    passwordActions.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="loginForm">
      <div>
        <input {...username} />
      </div>
      <div>
        <input {...password} />
      </div>
      <button type="submit" className="buttonLogin">
        Log in
      </button>
    </form>
  );
};

export default LoginForm;
