import { useDispatch, useSelector } from 'react-redux';
import { vote } from '../reducers/anecdoteReducer';
import { setNotification, resetNotification } from '../reducers/notificationReducer';

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
  const anecdotes = useSelector(({ anecdotes, filter, notification }) => {
    const list = (filter === '')
      ? [...anecdotes]
      : anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()));
    return list.sort((a, b) => {
      return b.votes - a.votes;
    });
  });

  const dispatch = useDispatch();

  const voteFor = (anecdote) => {
    dispatch(vote(anecdote.id));
    dispatch(setNotification(`you voted '${anecdote.content}'`))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000);
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
