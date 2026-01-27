import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Person from './components/Person'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newShown, setNewShown] = useState('')
  const [editMessage, setEditMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const setMessage = (message, type) => {
    console.log('msg', message)
    console.log('msgtype', type)
    setMessageType(type)
    setEditMessage(message)
    setTimeout(() => {
      setEditMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const tupla = persons.some(person => person.name === personObject.name)

    if (tupla) {
      const confirm = window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)
      if (confirm) {
        const editId = persons.find(n => n.name === newName).id

        personService
          .update(editId, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== editId ? person : returnedPerson))
            setMessage(`Updated ${returnedPerson.name}'s number`, 'edit')
          })
          .catch(error => {
            setMessage(`${newName}'s info has already been removed from server`, 'error')
            console.log('meni erroriin asti')
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          console.log(returnedPerson.name)
          setMessage(`Added ${returnedPerson.name}`, 'edit')
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = id => {
    const personName = persons.find(n => n.id === id).name
    const confirm = window.confirm(`Delete ${personName}?`, 'edit')

    if (confirm) {
      personService
      .deletePerson(id)
      .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage(`Deleted ${personName}'s number`, 'edit')
      })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(newShown.toLowerCase())
  )

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleShownChange = (event) => {
    setNewShown(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={editMessage} type={messageType} />
      <Filter newShown={newShown} handleShownChange={handleShownChange} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <div>
        {personsToShow.map(person =>
          <Person key={person.name} person={person} deletePerson={() => deletePerson(person.id)} />
        )}
      </div>
    </div>
  )

}

export default App