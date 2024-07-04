import axios from 'axios';
import { useState, useEffect } from 'react';

const api_key = import.meta.env.VITE_SOME_KEY;
console.log(api_key)

const Country = ({ name, capital, area, languages, flag, latlng }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&units=metric&appid=${api_key}`)
            .then(response => { 
                setWeather(response.data);
            });
    }, [latlng]);

    if (!weather) {
        return
    }
    
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
        <h3>Weather in {capital}:</h3>
        <div>Temperature: {weather.main.temp} Celcius</div>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
        <div>Wind: {weather.wind.speed} m/s</div>
        </div>
    );
};

export default Country;
