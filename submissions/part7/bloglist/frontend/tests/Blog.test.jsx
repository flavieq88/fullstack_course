import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "../src/components/Blog";

describe("<Blog />", () => {
  const blog = {
    title: "Title",
    author: "Author",
    likes: 2432,
    url: "URL",
    user: {
      username: "testing",
    },
  };

  const blogUser = {
    username: "testing",
    password: "wefsdfsdf",
  };

  test("renders title and author but not extra information", async () => {
    const { container } = render(<Blog blog={blog} user={blogUser} />);

    await screen.findByText("Title, by Author");

    const div = container.querySelector(".extendedInfo");
    expect(div).toHaveStyle("display: none");
  });

  test("renders the extra info after clicking on view button", async () => {
    const { container } = render(<Blog blog={blog} user={blogUser} />);

    const user = userEvent.setup();
    const button = screen.getByText("View");
    await user.click(button);

    const div = container.querySelector(".extendedInfo");
    expect(div).not.toHaveStyle("display: none");
  });

  test("calls the event handler when clicking like button", async () => {
    const handleLike = vi.fn();

    render(<Blog blog={blog} user={blogUser} updateBlog={handleLike} />);

    const user = userEvent.setup();
    const viewButton = screen.getByText("View");
    await user.click(viewButton);

    const likeButton = screen.getByText("Like");

    await user.click(likeButton);
    await user.click(likeButton);

    expect(handleLike.mock.calls).toHaveLength(2);
  });
});
