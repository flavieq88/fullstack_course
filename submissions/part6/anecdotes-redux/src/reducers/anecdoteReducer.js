import { createSlice } from '@reduxjs/toolkit';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload);
    },
    vote(state, action) {
      const anecdote = state.find(a => a.id === action.payload);
      return state.map(a => a.id === action.payload
        ? {...anecdote, votes: anecdote.votes + 1}
        : a
      );
    },
    setAnecdotes(state, action) {
      return action.payload;
    }
  }
});

export const { createAnecdote, vote, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
