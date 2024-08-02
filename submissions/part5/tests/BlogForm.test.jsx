import { render, screen } from '@testing-library/react';
import BlogForm from '../src/components/BlogForm';
import userEvent from '@testing-library/user-event';

describe('<BlogForm />', () => {
  test('calls onSubmit with correct details', async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm addBlog={createBlog} />);

    const titleInput = screen.getByPlaceholderText('Write title');
    const authorInput = screen.getByPlaceholderText('Write author');
    const urlInput = screen.getByPlaceholderText('Write URL');
    const sendButton = screen.getByText('Create');

    await user.type(titleInput, 'The best blog');
    await user.type(authorInput, 'Me');
    await user.type(urlInput, 'urlll');
    await user.click(sendButton);

    expect(createBlog.mock.calls).toHaveLength(1);

    expect(createBlog.mock.calls[0][0].title).toBe('The best blog');
    expect(createBlog.mock.calls[0][0].author).toBe('Me');
    expect(createBlog.mock.calls[0][0].url).toBe('urlll');
  });
});
