const Persons = ({ persons, filter }) => {
    let personsDisplay = []
    persons.forEach( (person) => {
      if (filter.toLowerCase() === person.name.toLowerCase().slice(0, filter.length)) {
        personsDisplay = personsDisplay.concat(person)
      }
    })
    if (filter.length === 0) {
      return (
        <ul>
          {persons.map(person => <li key={person.id}>{person.name} {person.number}</li>)}
        </ul>
      )
    }
    return (
      <ul>
        {personsDisplay.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
      </ul>
    )
  }

  export default Persons