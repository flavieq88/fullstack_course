import { useField } from "../hooks";
import { useDispatch } from "react-redux";
import { loginUser } from "../reducers/userReducer";
import { notify } from "../reducers/notifReducer";
import userService from "../services/users";

const SignupForm = () => {
  const [username, usernameActions] = useField("text", "Username");
  const [name, nameActions] = useField("text", "Name");
  const [password, passwordActions] = useField("password", "Password");

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await userService.signup({
        username: username.value,
        name: name.value,
        password: password.value,
      });

      dispatch(loginUser(username.value, password.value));
    } catch (exception) {
      if (exception.response.data.error.includes("unique")) {
        dispatch(
          notify({ message: "Username already taken", color: "red" }, 2),
        );
      } else {
        dispatch(
          notify(
            { message: "Invalid username, name or password", color: "red" },
            2,
          ),
        );
      }
    }

    usernameActions.reset();
    nameActions.reset();
    passwordActions.reset();
  };

  return (
    <div className="signupForm">
      <h2>Don't own an account? Sign up for free!</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input {...username} />
          <div className="tooltip">
            <strong>&#9432;</strong>{" "}
            <span className="tooltiptext">3 characters minimum</span>
          </div>
        </div>
        <div>
          <input {...name} />
          <div className="tooltip">
            <strong>&#9432;</strong>{" "}
            <span className="tooltiptext">3 characters minimum</span>
          </div>
        </div>
        <div>
          <input {...password} />
          <div className="tooltip">
            <strong>&#9432;</strong>{" "}
            <span className="tooltiptext">8 characters minimum</span>
          </div>
        </div>
        <button type="submit" className="buttonLogin">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
