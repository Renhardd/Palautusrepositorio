const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach(blog => {
    sum += blog.likes
  })
  return sum
}

const favoriteBlog = (blogs) => {
  let mostLikes = 0
  let favBlog = null
  blogs.forEach(blog => {
    if (blog.likes > mostLikes) {
      favBlog = blog
      mostLikes = blog.likes
    }
  })
  return favBlog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}