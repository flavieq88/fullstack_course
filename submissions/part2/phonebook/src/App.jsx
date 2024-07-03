import { useState, useEffect } from 'react';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

import personsService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const nameObject = {
       name: newName,
       number: newNumber,
    };
    
    if (persons.map((person) => person.name.toLowerCase()).includes(newName.toLowerCase())) { //already in phonebook
      if (window.confirm(`${newName} is already in the phonebook. Would you like to replace old number with new number?`)) {
        const [double] = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase());
        updateNumber(double, newNumber);
      };
      setNewName('');
      setNewNumber('');
    }
    else {
      personsService
        .create(nameObject)
        .then(response => setPersons(persons.concat(response.data)));
      setNewName('');
      setNewNumber('');
    };
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value);
  };

  const deletePersonApp = (id) => {
    const person = persons.find(n => n.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.deletePerson(id);
      setPersons(persons.filter(n => n.id !== id));
    };
  };

  const updateNumber = (person, number) => {
    const newObject = { ...person, number:number}
    personsService
      .update(person.id, newObject)
      .then(response => setPersons(persons.map(p => p.id !== person.id ? p : response.data)));
  };
  


  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={newFilter} handleNewFilter={handleNewFilter}/>

      <h3>Add a new person</h3>

      <PersonForm 
        onSubmit={addPerson}
        nameValue={newName} nameOnChange={handleNameChange}
        numberValue={newNumber} numberOnChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={persons} filter={newFilter} deletePerson={deletePersonApp} />

    </div>
  );
};

export default App;