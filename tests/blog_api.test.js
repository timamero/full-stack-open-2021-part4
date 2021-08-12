const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogs')
const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => {
    return new Blog(blog)
  })
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  // npm test -- -t "blogs are returned as json"
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /json/)
})

test('all blogs are returned', async () => {
  // npm test -- -t "all blogs are returned"
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('unique identifier is id', async () => {
  // npm test -- -t "unique identifier is id"
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  // npm test -- -t "a valid blog can be added"
  const newBlog = {
    title: "Microfrontends with React",
    author: "kpiteng",
    url: "https://dev.to/kpiteng/microfrontends-with-react-47jb",
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /json/)

  const response = await api.get('/api/blogs')
  const responseObject = {
    title: response.body[initialBlogs.length].title,
    author: response.body[initialBlogs.length].author,
    url: response.body[initialBlogs.length].url,
    likes: response.body[initialBlogs.length].likes,
  }

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(responseObject).toEqual(newBlog)
})

test('if like property is missing, add property with default value of 0', async () => {
  // npm test -- -t "if like property is missing, add property with default value of 0"
  const newBlog = {
    title: "Microfrontends with React",
    author: "kpiteng",
    url: "https://dev.to/kpiteng/microfrontends-with-react-47jb",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /json/)

  const response = await api.get('/api/blogs')
  const likes = response.body[initialBlogs.length].likes

  expect(likes).toBe(0)
})

test('if title is missing response with Bad Request', async () => {
  // npm test -- -t "if title is missing response with Bad Request"
  const newBlog = {
    author: "kpiteng",
    url: "https://dev.to/kpiteng/microfrontends-with-react-47jb",
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('if url is missing response with Bad Request', async () => {
  // npm test -- -t "if url is missing response with Bad Request"
  const newBlog = {
    title: "Microfrontends with React",
    author: "kpiteng",
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  // npm test -- -t "a blog can be deleted"
  const responseAtStart = await api.get('/api/blogs')
  const blogsAtStart = responseAtStart.body
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const responseAtEnd = await api.get('/api/blogs')
  const blogsAtEnd = responseAtEnd.body
  expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogToDelete.title)
})

afterAll(() => {
  mongoose.connection.close()
})