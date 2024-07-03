import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then((response) => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
       name: newName,
       number: newNumber,
       id: persons.length + 1
    }
    
    if (persons.map((person) => person.name.toLowerCase()).includes(newName.toLowerCase())) {
      window.alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
    }
    else {
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value)
  }


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

      <Persons persons={persons} filter={newFilter} />

    </div>
  )
}

export default App