const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('log in to application')
    await expect(page.getByLabel('username')).toBeVisible
    await expect(page.getByLabel('password')).toBeVisible
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
        const blogi = {
            title: 'Tämä on artikkelin nimi',
            author: 'Artti Arttinen',
            url: 'https://www.url.com',
            likes: '1'
        }

        await createBlog(page, blogi)

        const okDiv = page.locator('.ok')
        await expect(okDiv).toContainText('a new blog Tämä on artikkelin nimi by Artti Arttinen added')
        await expect(page.getByText('Tämä on artikkelin nimi Artti Arttinen')).toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
        const blogi = {
            title: 'Tämä on artikkelin nimi',
            author: 'Artti Arttinen',
            url: 'https://www.url.com',
            likes: '1'
        }

        await createBlog(page, blogi)

        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('Likes: 2')).toBeVisible()
    })

    test('blog can be deleted by user who added it', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept())
        const blogi = {
            title: 'Tämä on artikkelin nimi',
            author: 'Artti Arttinen',
            url: 'https://www.url.com',
            likes: '1'
        }

        await createBlog(page, blogi)
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()

        const okDiv = page.locator('.ok')
        await expect(okDiv).toContainText('blog deleted')

        await expect(page.getByText('Tämä on artikkelin nimi')).not.toBeVisible()
        await expect(page.getByText('blogs')).toBeVisible()
    })

    test('remove button only visible on blogs added by logged in user', async ({ page, request }) => {
        const blogi = {
            title: 'Tämä on artikkelin nimi',
            author: 'Artti Arttinen',
            url: 'https://www.url.com',
            likes: '1',
        }

        await createBlog(page, blogi)
        await page.getByRole('button', { name: 'logout' }).click()
        
        await request.post('/api/users', {
          data: {
          name: 'Testi Testaaja',
          username: 'testari',
          password: 'salainen'
          }
        })

        await loginWith(page, 'testari', 'salainen')

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('remove')).not.toBeVisible()
    })

    test('blogs are sorted by likes from highest to lowest', async ({ page }) => {
        const blog1 = {
          title: 'Tämä on artikkelin nimi',
          author: 'Artti Arttinen',
          url: 'https://www.url.com',
          likes: '1',
        }
        await createBlog(page, blog1)
        await expect(page.getByText('Tämä on artikkelin nimi Artti Arttinen')).toBeVisible()
        await page.getByRole('button', { name: 'cancel' }).click()
        

        const blog2 = {
          title: 'Tämä on artikkelin nimi2',
          author: 'Artti Arttinen2',
          url: 'https://www.url.com',
          likes: '2',
        }
        await createBlog(page, blog2)
        await expect(page.getByText('Tämä on artikkelin nimi2 Artti Arttinen2')).toBeVisible()
        await page.getByRole('button', { name: 'cancel' }).click()
        

        const blog3 = {
          title: 'Tämä on artikkelin nimi3',
          author: 'Artti Arttinen3',
          url: 'https://www.url.com',
          likes: '3',
        }
        await createBlog(page, blog3)
        await expect(page.getByText('Tämä on artikkelin nimi3 Artti Arttinen3')).toBeVisible()
        await page.getByRole('button', { name: 'cancel' }).click()
        
        await expect(page.locator('.blog')).toHaveCount(3)
        const renderedBlogs = await page.locator('.blog').allTextContents()
        console.log(renderedBlogs)

        expect(renderedBlogs[0] === 'Tämä on artikkelin nimi3 Artti Arttinen3')
        expect(renderedBlogs[2] === 'Tämä on artikkelin nimi Artti Arttinen')
      })
  })
})