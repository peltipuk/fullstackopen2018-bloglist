const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.status(200).json(blog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    console.log(exception.message)
    response.status(400).send({ error: 'malformatted id' })
  }
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

blogsRouter.put('/:id', async (request, response) => {
  try {
    const blog = {
      url: request.body.url,
      likes: request.body.likes
    }
    console.log(`Updating blog ${request.params.id} with values`, blog)
    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, blog, { new: true })
    if (updatedBlog) {
      console.log('Updated blog:', updatedBlog)
      response.status(200).json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (err) {
    console.log(`Cannot update blog ${request.params.id}`, err)
    response.status(500).json({ error: err.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    console.log('Deleting blog:', blog)
    response.status(204).end()
  } catch (err) {
    console.log(`Error deleting blog ${request.params.id}`, err)
  }
})

module.exports = blogsRouter
