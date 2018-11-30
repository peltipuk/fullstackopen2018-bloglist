const User = require('../models/user')

const initialUsers = [
  {
    'username': 'Paavo',
    'name': 'Paavo Nieminen',
    'adult': false,
    'passwordHash': '$2b$10$H6hgySVsGcsMN17Ha91hsOEpHdbQlYg0pcW7CiorH8errZLjZ1zg.',
  },
  {
    'username': 'Lepa',
    'name': 'Lepa Lahtinen',
    'adult': true,
    'passwordHash': '$2b$10$MyAxqxStgMB2yGFR3YtWO.4MP0nr.5l1UwW11g0jSwz12rj1Jp75.',
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User.format)
}

module.exports = {
  usersInDb, initialUsers
}
