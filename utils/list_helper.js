const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const reducer = (sum, current) => sum + current;
  return likes.reduce(reducer)
}

const favoriteBlog = (blogs) => {
  const max = Math.max(...blogs.map(blog => blog.likes))
  return blogs.find(blog => blog.likes === max)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}