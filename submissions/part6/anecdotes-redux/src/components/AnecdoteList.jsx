import { useDispatch, useSelector } from 'react-redux';
import { vote } from '../reducers/anecdoteReducer';

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
  const anecdotes = useSelector(state => [...state].sort((a, b) => {
    return b.votes - a.votes;
  }));
  const dispatch = useDispatch();

  return (
    <ul>
      {anecdotes.map(anecdote => 
        <Anecdote
          anecdote={anecdote}
          key={anecdote.id}
          handleClick={() => dispatch(vote(anecdote.id))}
        />
      )}
    </ul>
  );
};

export default AnecdoteList;
