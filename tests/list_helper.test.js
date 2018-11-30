const { totalLikes, favoriteBlog, mostBlogs, mostLikes } = require('../utils/list_helper')

const zeroBlogs = []
const oneBlog = [
  {
    _id: '5bfd3b296db6237930ecdf36',
    title: 'My Fancy Blog',
    author: 'James Moore',
    url: 'http://www.example.com',
    likes: 5,
  }
]

const twoBlogs = [
  {
    _id: '5bfd3b296db6237930ecdf36',
    title: 'My Fancy Blog',
    author: 'James Moore',
    url: 'http://www.example.com',
    likes: 5,
  },
  {
    _id: 'abcd3b296db6237930ecdf36',
    title: 'Some other blog',
    author: 'Kevin Bacon',
    url: 'http://www.example.com',
    likes: 2,
  },
]

const manyBlogs = [
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

describe('total likes', () => {
  test('no blogs at all', () => {
    expect(totalLikes(zeroBlogs)).toBe(0)
  })

  test('one blog', () => {
    expect(totalLikes(oneBlog)).toBe(5)
  })

  test('two blogs', () => {
    expect(totalLikes(twoBlogs)).toBe(7)
  })
})

describe('favorite blog', () => {
  test('no blogs at all', () => {
    expect(favoriteBlog(zeroBlogs)).toBeUndefined()
  })

  test('one blog', () => {
    expect(favoriteBlog(oneBlog)).toEqual({
      title: 'My Fancy Blog',
      author: 'James Moore',
      likes: 5
    })
  })

  test('two blogs', () => {
    expect(favoriteBlog(twoBlogs)).toEqual({
      title: 'My Fancy Blog',
      author: 'James Moore',
      likes: 5,
    })
  })

  test('many blogs', () => {
    expect(favoriteBlog(manyBlogs)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })
})

describe('most blogs', () => {
  test('no blogs at all', () => {
    expect(mostBlogs(zeroBlogs)).toBeUndefined()
  })

  test('one blog', () => {
    expect(mostBlogs(oneBlog)).toEqual({
      author: 'James Moore',
      blogs: 1
    })
  })

  test('many blogs', () => {
    expect(mostBlogs(manyBlogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('no blogs at all', () => {
    expect(mostLikes(zeroBlogs)).toBeUndefined()
  })

  test('one blog', () => {
    expect(mostLikes(oneBlog)).toEqual({
      author: 'James Moore',
      likes: 5
    })
  })

  test('many blogs', () => {
    expect(mostLikes(manyBlogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})
