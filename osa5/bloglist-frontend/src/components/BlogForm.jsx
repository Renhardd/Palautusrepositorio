import { useState } from 'react'

const BlogForm = ({ createBlog, user }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
      likes: likes,
      user: user.id
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title
            <input
              type="title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              placeholder='write title here'
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="author"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
              placeholder='write author here'
            />
          </label>
        </div>
        <div>
          <label>
          url
            <input
              type="url"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
              placeholder='write url here'
            />
          </label>
        </div>
        <div>
          <label>
          likes
            <input
              type="likes"
              value={likes}
              onChange={({ target }) => setLikes(target.value)}
              placeholder='write likes here'
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm