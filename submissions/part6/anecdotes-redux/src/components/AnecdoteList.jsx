import { useDispatch, useSelector } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { notify } from '../reducers/notificationReducer';

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <li>
      <div>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={handleClick}>vote</button>
          </div>
        </div>
    </li>
  );
};

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const list = (state.filter === '')
      ? [...state.anecdotes]
      : state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()));
    return list.sort((a, b) => {
      return b.votes - a.votes;
    });
  });

  const dispatch = useDispatch();

  const voteFor = (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(notify(`you voted '${anecdote.content}'`, 5));
  };

  return (
    <ul>
      {anecdotes.map(anecdote => 
        <Anecdote
          anecdote={anecdote}
          key={anecdote.id}
          handleClick={() => voteFor(anecdote)}
        />
      )}
    </ul>
  );
};

export default AnecdoteList;
