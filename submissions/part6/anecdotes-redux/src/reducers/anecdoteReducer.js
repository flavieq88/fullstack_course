import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
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

export const { appendAnecdote, vote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = content => {
  return async dispatch => {
    const anecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(anecdote));
  };
};

export default anecdoteSlice.reducer;
