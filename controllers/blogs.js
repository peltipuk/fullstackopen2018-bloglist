const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  if (blog.likes === undefined) {
    blog.likes = 0
  }

  if (blog.title === undefined) {
    console.log('Not adding blog without title')
    return response.status(400).json({ error: 'Missing title' })
  }
  if (blog.url === undefined) {
    console.log('Not adding blog without url')
    return response.status(400).json({ error: 'Missing url' })
  }
  console.log('Adding blog', blog)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter
