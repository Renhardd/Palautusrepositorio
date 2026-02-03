const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).end()
  }

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'cant delete other users blogs' })
  }

  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const oldBlog = await Blog.findById(request.params.id)

  oldBlog.title = request.body.title
  oldBlog.author = request.body.author
  oldBlog.url = request.body.url
  oldBlog.likes = request.body.likes

  const savedBlog = await oldBlog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter