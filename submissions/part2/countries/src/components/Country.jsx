const Country = ({ name, capital, area, languages, flag }) => {
    return (
        <div>
        <h2>{name}</h2>
        <div>Capital: {capital}</div>
        <div>Area: {area}</div>
        <h3>Languages:</h3>
        <ul>
            {Object.keys(languages).map(l => <li key={l}>{languages[l]}</li>)}
        </ul>
        <img src={flag} />
        </div>
    );
};

export default Country;
