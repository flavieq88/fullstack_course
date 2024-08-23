import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { notify } from "./notifReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      dispatch(setUser(user));

      dispatch(
        notify(
          { message: `${user.name} successfully signed in`, color: "green" },
          2,
        ),
      );
    } catch (exception) {
      dispatch(
        notify({ message: "Wrong username or password", color: "red" }, 2),
      );
    }
  };
};

export default userSlice.reducer;
