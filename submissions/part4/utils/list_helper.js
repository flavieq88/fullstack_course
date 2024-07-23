const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  let favorite = {};
  let maxLikes = 0;
  blogs.forEach(blog => {
    if (blog.likes > maxLikes) {
      favorite = blog;
      maxLikes = blog.likes;
    };
  });
  return favorite;
};

const mostBlogs = (blogs) => {
  const dictionary = {};
  blogs.forEach(blog => {
    const author = blog.author;
    dictionary[author] = (dictionary[author] === undefined)
      ? 1
      : dictionary[author] + 1;
  });

  let popularAuthor = '';
  let numberBlogs = 0;

  Object.keys(dictionary).forEach(author => {
    if (dictionary[author] > numberBlogs) {
      popularAuthor = author;
      numberBlogs = dictionary[author];
    };
  });

  return { author: popularAuthor, blogs: numberBlogs };
};

const mostLikes = (blogs) => {
  const dictionary = {};
  blogs.forEach(blog => {
    const author = blog.author;
    dictionary[author] = (dictionary[author] === undefined)
      ? blog.likes
      : dictionary[author] + blog.likes;
  });

  let popularAuthor = '';
  let numberLikes = 0;

  Object.keys(dictionary).forEach(author => {
    if (dictionary[author] > numberLikes) {
      popularAuthor = author;
      numberLikes = dictionary[author];
    };
  });

  return { author: popularAuthor, likes: numberLikes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
