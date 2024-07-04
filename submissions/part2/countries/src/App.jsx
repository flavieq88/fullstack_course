import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import List from "./components/List";

import axios from 'axios';


const App = () => {
  const [filter, setFilter] = useState('');
  const [matches, setMatches] = useState(null);


  useEffect(() => {
    console.log("effect run, filter is now", filter);

    if (filter) {
      axios
        .get("https://studies.cs.helsinki.fi/restcountries/api/all")
        .then(response => {
          setMatches(response.data.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase())))
        });
    }
    else {
      setMatches([])
    };
  }, [filter]);


  if (!matches) {
    return null
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleShow = (country) => {
    setMatches([country])
  }


  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <List matches={matches} handleShow={handleShow}/>
    </div>
  );
};

export default App;
