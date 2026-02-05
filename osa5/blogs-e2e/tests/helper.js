const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByPlaceholder('write title here').fill(blog.title)
  await page.getByPlaceholder('write author here').fill(blog.author)
  await page.getByPlaceholder('write url here').fill(blog.url)
  await page.getByPlaceholder('write likes here').fill(blog.likes)
  await page.getByRole('button', { name: 'create' }).click()
  await page.locator('.blog').filter({ hasText: `${blog.title} ${blog.author}` }).first().waitFor()
}

export { loginWith, createBlog }