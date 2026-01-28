const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

/*
if (process.argv.length < 3 || process.argv.length === 4) {
  console.log('give password as argument or phonenumber')
  process.exit(1)
}
*/

const url = process.env.MONGODB_URI

mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: (v) => {
                return /(?:\d{2}-\d{6}|\d{3}-\d{5})/.test(v)
            }
        }
    },
    id: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

/*
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const generateId = () => {
        const minCeiled = Math.ceil(100);
        const maxFloored = Math.floor(1000000);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled).toString()
    }

    const person = new Person({
        id: generateId(),
        name: process.argv[3].toString(),
        number: process.argv[4].toString(),
    })

    person.save().then(result => {
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
*/
module.exports = mongoose.model('Person', personSchema)