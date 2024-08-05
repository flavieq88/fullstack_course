const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create new blog' }).click();
  await page.getByPlaceholder('Write title').fill(title);
  await page.getByPlaceholder('Write author').fill(author);
  await page.getByPlaceholder('Write URL').fill(url);
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByText(`${title}, by ${author}`).waitFor(); //wait for the content to render
};

export { loginWith, createBlog };
