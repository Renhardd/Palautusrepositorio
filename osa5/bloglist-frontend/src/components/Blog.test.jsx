import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'title on title',
  author: 'author',
  url: 'https://www.url.com',
  likes: 11,
  user: '6981b534bb4c83220c5ec9fe'
}

test('renders title and author', () => {
  render(<Blog
    blog={blog}
    handleLike={() => {}}
    handleRemove={() => {}}
  />)

  const element = screen.getByText('title on title', { exact: false })

  expect(element).toBeDefined()
})

test('does not render url and likes'), () => {
  render(<Blog
    blog={blog}
    handleLike={() => {}}
    handleRemove={() => {}}
  />)

  const url = screen.queryByText('Url: https://www.url.com')
  const likes = screen.queryByText('Likes: 11')

  expect(url).toBeNull()
  expect(likes).toBeNull()
}

test('pressing view button renders blog details'), async () => {
  render(<Blog
    blog={blog}
    handleLike={() => {}}
    handleRemove={() => {}}
  />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.getByText('Url: https://www.url.com')
  const likes = screen.getByText('Likes: 11')

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
}

test('pressing like button twice calls event handler twice'), async () => {
  const mockHandler = vi.fn()
  render(<Blog
    blog={blog}
    handleLike={mockHandler}
    handleRemove={() => {}}
  />
  )

  const user = userEvent.setup()
  const buttonView = screen.getByText('view')
  await user.click(buttonView)

  const buttonLike = screen.getByText('like')
  await user.click(buttonLike)
  await user.click(buttonLike)

  expect(mockHandler.mock.calls).toHaveLength(2)
}

test('like button not rendered before clicking view button'), async () => {
  render(<Blog
    blog={blog}
    handleLike={() => {}}
    handleRemove={() => {}}
  />)

  expect(screen.queryByText('like').toBeNull)
}