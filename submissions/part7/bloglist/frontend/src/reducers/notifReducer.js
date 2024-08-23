import { createSlice } from "@reduxjs/toolkit";

const notifSlice = createSlice({
  name: "notification",
  initialState: { message: null, color: "green" },
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return { message: null, color: "green" };
    },
  },
});

export const { setNotification, clearNotification } = notifSlice.actions;

export const notify = (notifObject, time) => {
  return (dispatch) => {
    dispatch(setNotification(notifObject));
    setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
  };
};

export default notifSlice.reducer;
