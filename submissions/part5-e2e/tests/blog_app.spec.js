const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset'); //empty the db
    await request.post('/api/users', { //add one user to the db
      data: {
        username: 'flavie123',
        name: 'Flavie Qin',
        password: 'secret password'
      }
    });
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('.loginForm')).toBeVisible();
    await expect(page.locator('.signupForm')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'flavie123', 'secret password');

      const notificationDiv = page.locator('.notification');
      await expect(notificationDiv).toContainText('Flavie Qin successfully signed in');
      await expect(notificationDiv).toHaveCSS('border-style', 'solid');
      await expect(notificationDiv).toHaveCSS('color', 'rgb(0, 128, 0)');

      await expect(page.getByText('Flavie Qin is signed in')).toBeVisible();    
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'flavie123', 'wrong password!!');

      const notificationDiv = page.locator('.notification');
      await expect(notificationDiv).toContainText('Wrong username or password');
      await expect(notificationDiv).toHaveCSS('border-style', 'solid');
      await expect(notificationDiv).toHaveCSS('color', 'rgb(255, 0, 0)');

      await expect(page.getByText('Flavie Qin is signed in')).not.toBeVisible();    
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'flavie123', 'secret password');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'New Blog', 'Playwright', 'https://playwright.dev/docs/intro')
      await expect(page.getByText('New Blog, by Playwright')).toBeVisible();
    });

    describe('Many blogs already exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'First blog', 'Me', 'dummy url');
        await createBlog(page, 'Second blog', 'Me', 'dummy url');
        await createBlog(page, 'Third blog', 'Me', 'dummy url');
      });

      test('a blog can be liked', async ({ page }) => {
        const blog = page.getByText('First blog, by Me');
        await blog.getByRole('button', { name: 'View' }).click();
        await blog.getByRole('button', { name: 'Like' }).click();

        await expect(page.getByText('1 like')).toBeVisible();
      });

      test('a blog can be deleted by the user who created it', async ({ page }) => {
        const blog = page.getByText('First blog, by Me');
        await blog.getByRole('button', { name: 'View' }).click();
        page.on('dialog', dialog => {
          dialog.accept();
        });
        await blog.getByRole('button', { name: 'Delete blog' }).click();
        await expect(page.getByText('First blog, by Me')).not.toBeVisible();
      });

      test('blogs are listed in order of likes', async ({ page }) => {
        const thirdBlog = page.getByText('Third blog, by Me');
        await thirdBlog.getByRole('button', { name: 'View' }).click();
        await thirdBlog.getByRole('button', { name: 'Like' }).click();
        await thirdBlog.getByRole('button', { name: 'Like' }).click();

        const secondBlog = page.getByText('Second blog, by Me');
        await secondBlog.getByRole('button', { name: 'View' }).click();
        await secondBlog.getByRole('button', { name: 'Like' }).click();
        
        await secondBlog.getByText('1 like').waitFor(); //wait for the blog to be updated

        //after this, third blog has most likes, then second blog, then first blog
        //so that should be the order they appear in

        const blogs = await page.locator('.blog').all();

        expect(blogs[0]).toContainText('Third blog');
        expect(blogs[1]).toContainText('Second blog');
        expect(blogs[2]).toContainText('First blog');
      });

      describe('when a different user is logged in', () => {
        beforeEach(async ({ page, request }) => {
          await request.post('/api/users', { //create other user in the db
            data: {
              username: 'user2',
              name: 'Other user',
              password: '123456789'
            }
          });

          await page.getByRole('button', { name: 'Log out' }).click();
          await loginWith(page, 'user2', '123456789');
        });

        test('cannot see the delete button on blog that did not create', async ({ page }) => {
          const blog = page.getByText('First blog, by Me');
          await blog.getByRole('button', { name: 'View' }).click();

          expect(page.getByRole('button', { name: 'Delete blog' })).not.toBeVisible();
        });
      });
    });
  });
});
