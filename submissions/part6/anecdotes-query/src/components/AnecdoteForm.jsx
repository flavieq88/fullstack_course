import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../requests';
import { useNotifDispatch } from '../NotifContext';

const AnecdoteForm = () => {
  const dispatch = useNotifDispatch();
  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote));
    },
    onError: () => {
      dispatch({ type: 'SET_NOTIF', payload: 'too short anecdote, must have length 5 or more'});
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIF' });
      }, 2000);
    }
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    newAnecdoteMutation.mutate({ content, votes: 0 });

    dispatch({ type: 'SET_NOTIF', payload: `anecdote '${content}' added`});
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIF' });
    }, 2000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
