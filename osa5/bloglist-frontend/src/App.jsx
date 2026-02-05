import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      handleMessage('session restored', 'ok')
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      handleMessage(`logged in as ${user.username} successfully`, 'ok')
    } catch {
      handleMessage('wrong username or password', 'error')
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    handleMessage('logged out successfully', 'ok')
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      handleMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'ok')
    } catch {
      handleMessage('problem creating a new blog', 'error')
    }
  }

  const likeBlog = async (id, blogObject) => {
    const blogToLike = {
      title: blogObject.title,
      author: blogObject.author,
      url: blogObject.url,
      likes: blogObject.likes + 1,
      user: blogObject.user
    }

    const likedBlog = await blogService.update(id, blogToLike)
    setBlogs(blogs.map(blog => blog.id !== likedBlog.id ? blog : likedBlog))
    handleMessage(`added like to ${likedBlog.title}`, 'ok')
  }

  const deleteBlog = async (id, blogObject) => {
    const confirm = window.confirm(`Delete ${blogObject.title}?`, 'edit')

    if (confirm) {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      handleMessage('blog deleted', 'ok')
    }
  }

  const handleMessage = (message, type) => {
    console.log('msg', message)
    console.log('msgtype', type)
    setMessageType(type)
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const blogForm = () => (
    <Togglable buttonLabel="create new blog">
      <BlogForm
        createBlog={addBlog}
        user={user}
      />
    </Togglable>
  )

  const blogList = () => {
    const sortedBlogs = blogs.sort((b, a) => a.likes - b.likes)
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={likeBlog}
            handleRemove={deleteBlog}
            user={user}
          />
        )}
      </div>
    )
  }

  return (
    <div>
      <Notification message={message} messageType={messageType} />
      {!user && loginForm()}
      {user && (
        <div>
          {blogList()}
          {blogForm()}
        </div>
      )}
    </div>
  )
}

export default App