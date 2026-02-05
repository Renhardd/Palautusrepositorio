import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [blogDetailsVisible, setBlogDetailsVisible] = useState(false)

  return (
    <div style={blogStyle} className="blog">
      {!blogDetailsVisible && (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setBlogDetailsVisible(true)}>view</button>
        </div>
      )}

      {blogDetailsVisible && (
        <div>
          <p>
            Title: {blog.title}
            <button onClick={() => setBlogDetailsVisible(false)}>hide</button>
          </p>
          <p>Author: {blog.author}</p>
          <p>Url: {blog.url}</p>
          <p>
            Likes: {blog.likes}
            <button onClick={() => handleLike(blog.id, blog)}>like</button>
          </p>
          <p>Added by: {blog.user.name}</p>
          {blog.user.username === user.username && (
            <button onClick={() => handleRemove(blog.id, blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog