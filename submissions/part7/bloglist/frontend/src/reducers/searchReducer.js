import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: "",
  reducers: {
    searchChange(state, action) {
      return action.payload;
    },
    clearSearch() {
      return "";
    },
  },
});

export const { searchChange, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
