import { useState, useEffect } from 'react'
import weatherService from './../services/weather'

const CountryList = ({ countries }) => {
    const maat = countries.length

    if (maat > 1 && maat <= 5) return (
        <FewCountries countries={countries} />
    )
    
    if (maat === 1)
        return (
        <OneCountry country={countries[0]} />
    )

    return (
        <div>
            <p>Too many matches, specify another filter</p>
        </div>
    )
}

const FewCountries = ({ countries}) => {
    return (
        <div>
          {countries.map(country =>
            <p key={country.name.common}>
                {country.name.common}
            </p>
            )}
        </div>
    )
}

const OneCountry = ({ country }) => {
    const [weather, setWeather] = useState(null)
    
    useEffect(() => {
        weatherService
          .getWeather(country.capital)
          .then(weatherData => {
            setWeather(weatherData)
          })
      }, [weather])

    if (!weather) return null

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital {country.capital}</p>
            <p>Area {country.area}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(language =>
                    <li key={language[0]}>{language}</li>
                )}
            </ul>
            <img src={country.flags.png} />
            <h2>Weather in {country.capital}</h2>
            <p>Temperature {weather.main.temp} Celsius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
            <p>Wind {weather.wind.speed} m/s</p>
        </div>
    )
}

export default CountryList