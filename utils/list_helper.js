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
  // Failing for multiple blogs, complete later

  let countedAuthors = []
  for (let i = 0; i < blogs.length; i++) {
    if (!countedAuthors.map(item => item.author).includes(blogs[i].author)) {
      // If author not on list, add to list and start count at 1
      countedAuthors.push({"author": blogs[i].author, "blogs": 1})
    } else {
      // Increment blog count for author by 1
      countedAuthors = countedAuthors.map(item => {
        if (item.author === blogs[i].author) {
          return {"author": item.author, "blogs": item.blogs++}
        } else {
          return item
        }
      })
    }
  }
  console.log('counted authors', countedAuthors)
  return countedAuthors[0]
}

// Complete later
// const mostLikes = () => {

// }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}