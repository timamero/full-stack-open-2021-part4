const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  let blogObject
  if (request.body.likes) {
     blogObject = request.body
  } else {
    blogObject = {
      ...request.body,
      likes: 0
    }  
  }

  const blog = new Blog(blogObject)

  const result = await blog.save()
  response.status(200).json(result)
})

module.exports = blogsRouter