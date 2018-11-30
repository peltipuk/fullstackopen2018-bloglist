const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const username = body.username
    const password = body.password

    const existingUsers = await User.find({ username: username })
    if (existingUsers.length > 0) {
      return response.status(409).json({ error: `User already exists: ${username}` })
    }
    if (password.length < 3) {
      return response.status(400).json({ error: 'Password should be at least 3 characters long' })
    }

    const rounds = 10
    const hash = await bcrypt.hash(password, rounds)
    const user = new User({
      username: username,
      name: body.name,
      adult: body.adult === undefined ? true : body.adult,
      passwordHash: hash,
      blogs: [],
    })

    const savedUser = await user.save()
    response.json(savedUser)
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: 'something wrong' })
  }
})

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { likes: 1, author: 1, title: 1, url: 1 })
    response.status(200).json(users.map(User.format))
  } catch (error) {
    console.log(error)
  }
})

module.exports = usersRouter
