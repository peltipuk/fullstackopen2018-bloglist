const supertest = require('supertest')
const { app, server, waitForServer } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')

beforeAll(async () => {
  await waitForServer()
})

describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {

    console.log('Initializing blogs')
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  describe('blogs api', () => {
    test('blogs are returned as json', async () => {
      const blogsInDatabase = await blogsInDb()
      const response = await api.get('/api/blogs')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/application\/json/)

      expect(response.body.length).toBe(blogsInDatabase.length)

      const returnedTitles = response.body.map(b => b.title)
      blogsInDatabase.forEach(blog => {
        expect(returnedTitles).toContain(blog.title)
      })
    })

    test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
      const blogsInDatabase = await blogsInDb()
      const aBlog = blogsInDatabase[0]
      console.log('aBlog:', aBlog)

      const response = await api
        .get(`/api/blogs/${aBlog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      console.log('Individual:', response.body)
      expect(response.body.title).toBe(aBlog.title)
    })

    test('404 returned by GET /api/blogs/:id with nonexisting valid id', async () => {
      const validNonexistingId = await nonExistingId()
      console.log('validNonExistingId', validNonexistingId)
      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('400 is returned by GET /api/blogs/:id with invalid id', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', async () => {
    test('new valid blog can be posted', async () => {
      const blogsAtStart = await blogsInDb()

      const newBlog = {
        title: 'Some exciting blog',
        author: 'Mr. Exciting',
        url: 'www.exciting.com/blog',
        likes: 3
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      const titles = blogsAfterOperation.map(b => b.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
      expect(titles).toContain('Some exciting blog')
    })

    test('initial likes count is 0 if not defined explicitly', async () => {
      const newBlog = {
        title: 'Adventure Blog',
        author: 'Jekyll',
        url: 'www.adventures.com/blog',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const blogsAfterOperation = await blogsInDb()
      const newlyAddedBlog = blogsAfterOperation.find(blog => blog.title === 'Adventure Blog')
      expect(newlyAddedBlog).toBeDefined()
      expect(newlyAddedBlog.likes).toBe(0)
    })

    test.only('blog should contain title and url', async () => {
      const blogWithoutTitle = {
        author: 'James Bond',
        url: 'www.007.com'
      }

      await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400)

      let blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.find(blog => blog.author === 'James Bond'))
        .not.toBeDefined()

      const blogWithoutUrl = {
        author: 'James Bond',
        title: 'Secret Agent Blog'
      }

      await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400)

      blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation
        .find(blog => blog.author === 'James Bond'))
        .not.toBeDefined()
    })
  })

  describe('deletion of a blog', async () => {
    test('deletion of a single blog', async () => {
      const blogsAtStart = await blogsInDb()
      const blogToBeDeleted = blogsAtStart[0]

      const response = await api.delete(`/api/blogs/${blogToBeDeleted.id}`)

      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart - 1)
      expect(blogsAfterOperation.find(blog => blog.id === blogToBeDeleted.id))
        .not.toBeDefined()
    })
  })
})

afterAll(() => {
  server.close()
})
