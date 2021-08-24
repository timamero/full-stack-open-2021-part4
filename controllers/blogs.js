const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token is missing or invalid' })
  }

  const user = request.user

  if (!body.title) {
    return response.status(400).json({
      error: 'title missing'
    })
  }

  if (!body.url) {
    return response.status(400).json({
      error: 'url missing'
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id
  })
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(200).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log('b - decodedToken', decodedToken)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token is missing or invalid' })
  }
  console.log('b - decodedToken', decodedToken)
  const user = request.user
  console.log('b - user', user)

  try {
    console.log('b - beginning of try')
    console.log('b - request.params.id', request.params.id)
    const blog = await Blog.findById(request.params.id)
    console.log('b - blog', blog)
    if (!blog) {
      console.log('b - blog not found')
      return response.status(400).json({ error: 'blog does not exist are was already deleted'})
    }
    console.log('b - blog.user.toString()', blog.user.toString())
    console.log('b - user._id.toString()', user._id.toString())
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'user is not authorized to delete this blog'})
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()

  } catch(exception) {
    console.log('b - catch exception')
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  try {
    const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedNote)
  } catch(exception) {
    next(exception)
  }  
})

module.exports = blogsRouter