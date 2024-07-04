import Country from './Country'

const List = ({ matches }) => {
    
    if (matches.length === 1) {
      const country = matches[0]
      return(
        <Country 
          name={country.name.common} 
          capital={country.capital[0]}
          area={country.area}
          languages={country.languages}
          flag={country.flags.png}
        />
      )
    };

    if (matches.length <= 10) { //this includes empty matches
      return ( 
        <div>{matches.map(country => <div key={country.name.common}>{country.name.common}</div>)}</div>
      );
    };

    return (
      <div>Too many matches, specify another filter</div>
    )
  };

  export default List