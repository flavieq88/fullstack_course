const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, createNote } = require('./helper')

describe('Note app', () =>  {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Flavie Qin',
        username: 'flavie123',
        password: 'secret'
      }
    });
    await page.goto('/');

  });

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes');
    await expect(locator).toBeVisible();
    await expect(page.getByText('Note app following the FullStackOpen course of the Department of Computer Science, University of Helsinki 2024')).toBeVisible();
  });

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'flavie123', 'secret');
    await expect(page.getByText('Flavie Qin logged in')).toBeVisible();
  });

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'flavie123', 'wrong password!');

    const errorDiv = await page.locator('.error');
    await expect(errorDiv).toContainText('Wrong username or password');
    await expect(errorDiv).toHaveCSS('border-style', 'solid');
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');

    await expect(page.getByText('Flavie Qin logged in')).not.toBeVisible();
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'flavie123', 'secret');
    });

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a new note can be created by playwright');
      await expect(page.getByText('a new note can be created by playwright')).toBeVisible();
    });

    describe('and several notes exist', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note');
        await createNote(page, 'second note');
        await createNote(page, 'third note');
      });

      test('importance can be changed for one of the notes', async ({ page }) => {
        await page.pause();
        await page.getByText('second note')
          .getByRole('button', { name: 'make not important' }).click();
        await expect(page.getByText('make important')).toBeVisible();
      });
    });
  });
});
