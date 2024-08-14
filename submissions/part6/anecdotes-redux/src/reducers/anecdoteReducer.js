import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    updateAnecdote(state, action) {
      const id = action.payload.id;
      return state.map(a => a.id === id
        ? action.payload
        : a
      );
    },
    setAnecdotes(state, action) {
      return action.payload;
    }
  }
});

export const { appendAnecdote, updateAnecdote, setAnecdotes } = anecdoteSlice.actions;

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

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const changedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const response = await anecdoteService.update(changedAnecdote.id, changedAnecdote);
    dispatch(updateAnecdote(response));
  };
};

export default anecdoteSlice.reducer;
