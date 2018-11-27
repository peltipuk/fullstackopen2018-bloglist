const totalLikes = require('../utils/list_helper').totalLikes

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