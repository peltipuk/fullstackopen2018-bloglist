const supertest = require('supertest')
const { app, server, waitForServer } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { usersInDb, initialUsers } = require('./user_test_helper')

beforeAll(async () => {
  console.log('user: wait for server')
  await waitForServer()
})

describe('when there are some users in the database', async () => {
  beforeAll(async () => {
    console.log('Initializing users')
    await User.remove({})

    const userObjects = initialUsers.map(u => new User(u))
    const promiseArray = userObjects.map(u => u.save())
    await Promise.all(promiseArray)
  })

  test('users are returned', async () => {
    const response = await api.get('/api/users')
    console.log('Users in database:', response.body)
    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/application\/json/)
    expect(response.body.length).toBeGreaterThan(0)
  })

  test('too short passwords are not accepted', async () => {
    const usersAtStart = await usersInDb()
    const newUser = {
      username: 'Jeff',
      name: 'Jeff Jefferson',
      password: 'as'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)

    expect(response.status).toBe(400)
    expect(response.body.error).toMatch(/at least 3 characters/)

    const usersAfterOperation = await usersInDb()
    expect(usersAtStart.length).toBe(usersAfterOperation.length)
  })

  test('duplicate users are not accepted', async () => {
    const usersAtStart = await usersInDb()
    const newUser = {
      username: 'Paavo',
      name: 'Jeff Jefferson',
      password: 'asafaseawraweda'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)

    expect(response.status).toBe(409)
    expect(response.body.error).toMatch(/User already exists/)
    const usersAfterOperation = await usersInDb()
    expect(usersAtStart.length).toBe(usersAfterOperation.length)
  })
})
