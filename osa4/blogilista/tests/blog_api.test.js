const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await helper.blogsInDb()

  assert.strictEqual(response.length, helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await helper.blogsInDb()

  const contents = response.map(e => e.title)
  assert(contents.includes('React patterns'), true)
})

test('blog id is returned as id not _id', async () => {
    const response = await helper.blogsInDb()

    assert(response[0].id !== undefined && response[0]._id === undefined)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Testiblogi',
    author: 'Testari Testaaja',
    url:'https://www.testaus.fi',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(titles.includes('Testiblogi'))
})

test('if likes not defined, likes set to 0'), async () => {
    const newBlog = {
    title: 'Testiblogi',
    author: 'Testari Testaaja',
    url:'https://www.testaus.fi'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  console.log(blogsAtEnd[blogsAtEnd.length - 1])
  assert(blogsAtEnd[blogsAtEnd.length - 1].likes === 0)
}

test('blog without title or url cannot be added added', async () => {
  const newBlog = {
    author: 'Matti Meikäläinen'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog can be deleted with id'), async () => {
  const BlogsAtStart = await helper.blogsInDb()
  const blogToDelete = BlogsAtStart[0]
  
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(BlogsAtStart.length - 1, blogsAtEnd.length)
}

test('blog can be updated', async () => {
    const blogs = await helper.blogsInDb()
    const newBlog = blogs[0]
    const editedBlog = {
        title: 'muutettu',
        author: newBlog.author,
        url: newBlog.url,
        likes: newBlog.likes
    }

    await api
      .put(`/api/blogs/${newBlog.id}`)
      .send(editedBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    assert(blogsAtEnd[0].title === 'muutettu')
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is undefined', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'roottter',
      name: 'Superuser',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('username or password undefined'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is undefined', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Superuser',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('username or password undefined'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})


after(async () => {
  await mongoose.connection.close()
})