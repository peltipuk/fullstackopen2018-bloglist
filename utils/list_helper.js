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

module.exports = {
  dummy, totalLikes, favoriteBlog
}
