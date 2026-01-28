const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length === 4) {
  console.log('give password as argument or phonenumber')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://renhard:${password}@puhelinluettelo.dazgby4.mongodb.net/?retryWrites=true&w=majority&appName=puhelinluettelo`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const generateId = () => {
    const minCeiled = Math.ceil(100)
    const maxFloored = Math.floor(1000000)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled).toString()
  }

  const person = new Person({
    id: generateId(),
    name: process.argv[3].toString(),
    number: process.argv[4].toString(),
  })

  person.save().then(result => {
    console.log(result)
    console.log('Added ', process.argv[3], ' number ', process.argv[4], ' to phonebook')
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}