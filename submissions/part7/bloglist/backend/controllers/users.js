const bcrypt = require("bcrypt");
const User = require("../models/user");
const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    author: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 8) {
    return response.status(400).json({ error: "Invalid password" });
  }

  const passwordHash = await bcrypt.hash(password, 10); //use 10 salt rounds

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
