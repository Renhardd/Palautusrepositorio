import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const newUser = {
    id: '6981b534bb4c83220c5ec9fe'
  }

  render(<BlogForm createBlog={createBlog} user={newUser} />)

  const input = screen.getByPlaceholderText('write title here')
  const sendButton = screen.getByText('create')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  console.log(createBlog.mock.calls)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
})