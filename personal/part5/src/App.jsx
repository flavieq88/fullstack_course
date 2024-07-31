import { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import Togglable from './components/Togglable';
import noteService from './services/notes';
import loginService from './services/login';

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  };
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app following the FullStackOpen course of the Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    };
  }, []);

  const noteFormRef = useRef();


  if (!notes) {
    return null;
  };

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          error.response.data.error
        );
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000);
      });
  };

  const notesToShow = showAll //condition
  ? notes //if true
  : notes.filter(note => note.important); //if false, only show the important notes
  
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };
    
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote)) //if correct ID then update new note
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        setNotes(notes.filter(n => n.id !== id)); //filter returns array containing only elements that satisfy the condition
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    
    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      );
      noteService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong username or password');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      setUsername('');
      setPassword('');
    };
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteAppUser');
    setUser(null);
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && <div>
        <Togglable buttonLabel='log in'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
      }

      {user && <div>
        <p>
          {user.name} logged in 
          <button onClick={handleLogout}>Log out</button>
        </p>
        <Togglable buttonLabel='new note' ref={noteFormRef}>
          <NoteForm 
            createNote={addNote}
          />
        </Togglable>
      </div>
      }

      <h2>Notes</h2>

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ?'important' :'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>


      <Footer />
    </div>
  );
};

export default App;
