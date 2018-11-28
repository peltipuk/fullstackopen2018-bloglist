const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((prev, cur) => prev + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((prev, cur) => {
    if (prev === undefined) {
      return cur
    }
    return cur.likes > prev.likes ? cur : prev
  }, undefined)
  return favoriteBlog === undefined ? undefined : {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = (blogs) => {
  const authors = {} // Map from authors to number of blogs
  return blogs.reduce((prev, cur) => {
    const author = authors[cur.author]
    if(author === undefined) {
      authors[cur.author] = {
        author: cur.author,
        blogs: 1
      }
    } else {
      authors[cur.author].blogs++
    }
    if(prev === undefined) {
      return authors[cur.author]
    } else {
      return prev.blogs > authors[cur.author].blogs ? prev : authors[cur.author]
    }
  }, undefined)
}

const mostLikes = (blogs) => {
  const authors = {} // Map from authors to number of likes
  return blogs.reduce((prev, cur) => {
    const author = authors[cur.author]
    if(author === undefined) {
      authors[cur.author] = {
        author: cur.author,
        likes: cur.likes
      }
    } else {
      authors[cur.author].likes += cur.likes
    }
    if(prev === undefined) {
      return authors[cur.author]
    } else {
      return prev.likes > authors[cur.author].likes ? prev : authors[cur.author]
    }
  }, undefined)
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
