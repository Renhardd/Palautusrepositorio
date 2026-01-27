import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import countryService from './services/countries'
import CountryList from './components/CountryList'


function App() {
  const [countries, setCountries] = useState([])
  const [newShown, setNewShown] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleShownChange = (event) => {
    setNewShown(event.target.value)
  }

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(newShown.toLowerCase())
  )

  return (
    <div>
      <Filter newShown={newShown} handleShownChange={handleShownChange} />
      <CountryList countries={countriesToShow} />
    </div>
  )
}

export default App