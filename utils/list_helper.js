const { forEach } = require('lodash');
var _ = require('lodash');

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

const mostBlogs = (blogs) => {
  const count = _.countBy(blogs, 'author')
  const blogCountByAuthor = []
  
  _.forEach(count, (value, key) => {
    blogCountByAuthor.push({author: key, blogs: value})
  })
  const max = _.maxBy(blogCountByAuthor, 'blogs')
  
  return max
}

const mostLikes = (blogs) => {
  const authorGroups = _.groupBy(blogs, 'author')
  const likesCountByAuthor = []

  _.forEach(authorGroups, (value, key) => {
    const totalLikes = _.reduce(value, (result,value,key) => {
      return result + value.likes
    }, 0)
    likesCountByAuthor.push({author: key, likes: totalLikes})
  })

  const max = _.maxBy(likesCountByAuthor, 'likes')
  return max
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}