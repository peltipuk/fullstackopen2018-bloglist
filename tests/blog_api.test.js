const supertest = require('supertest')
const { app, server, waitForServer } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

beforeAll(async () => {
  await waitForServer()
  console.log('Initializing blogs')
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(
    {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

// Using promises
/*
describe.only('blogs api', () => {
  test('blogs are returned as json', (done) => {
    api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then(() => {
        done()
      })
  })
})
*/

// Using async/await
describe.only('blogs api', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')

    //console.log('Response headers: ', response.headers)
    //console.log('Response body:', response.body)
    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)

    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('new blog can be posted', async () => {
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

    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)
    expect(response.body.length).toBe(initialBlogs.length + 1)
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

    const response = await api.get('/api/blogs')
    const newReturnedBlog = response.body.find(blog => blog.title === 'Adventure Blog')
    expect(newReturnedBlog).toBeDefined()
    expect(newReturnedBlog.likes).toBe(0)
  })

  test('blog should contain title and url', async () => {
    const blogWithoutTitle = {
      author: 'James Bond',
      url: 'www.007.com'
    }

    await api
      .post('/api/blogs')
      .send(blogWithoutTitle)
      .expect(400)

    let response = await api.get('/api/blogs')
    expect(response.body.map(blog => blog.author)).not.toContain('James Bond')

    const blogWithoutUrl = {
      author: 'James Bond',
      title: 'Secret Agent Blog'
    }

    await api
      .post('/api/blogs')
      .send(blogWithoutUrl)
      .expect(400)

    response = await api.get('/api/blogs')
    expect(response.body.map(blog => blog.author)).not.toContain('James Bond')
  })
})

afterAll(() => {
  server.close()
})
