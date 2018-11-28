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
  console.log('beforeAll')
  const value = await waitForServer()
  console.log('waitForServer value:', value)
  console.log('Deleting all blogs')
  await Blog.remove({})
  console.log('Deleted')

  const blogObjects = initialBlogs.map(blog => new Blog(
    {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    }))
  console.log('Initializing blogs')
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  console.log('Initialized')
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

    console.log('Response headers: ', response.headers)
    console.log('Response body:', response.body)
    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)

    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('new blog can be posted', async () => {
    const newBlog = new Blog({
      title: 'Some exciting blog',
      author: 'Mr. Exciting',
      url: 'www.exciting.com/blog',
      likes: 3
    })

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
})


afterAll(() => {
  server.close()
})
