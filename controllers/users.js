const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const rounds = 10
    const hash = await bcrypt.hash(body.password, rounds)
    const user = new User({
      username: body.username,
      name: body.name,
      adult: body.adult === undefined ? true : body.adult,
      passwordHash: hash
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
    const users = await User.find({})
    response.status(200).json(users.map(User.format))
  } catch (error) {
    console.log(error)
  }
})

module.exports = usersRouter