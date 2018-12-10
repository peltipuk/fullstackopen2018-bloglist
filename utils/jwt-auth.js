const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const jwtAuth = (request, response, next) => {
  const token = getTokenFrom(request)
  response.locals.user = { authenticated: false }
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      console.log('decodedToken', decodedToken)
      response.locals.user.id = decodedToken.id
      response.locals.user.username = decodedToken.username
      response.locals.user.authenticated = true
    } catch (exception) {
      if (exception.name === 'JsonWebTokenError') {
        console.log('JsonWebTokenError')
      } else {
        console.log(exception)
        return response.status(500).json({ error: exception.message })
      }
    }
  } else {
    console.log('no token')
  }
  next()
}

const debugAuth = (request, response, next) => {
  console.log('AUTH:', response.locals.user)
  next()
}

// Test middleware order and matching
const mymarker = (marker) => (request, response, next) => {
  console.log('MARKER:', marker)
  next()
}

module.exports = { jwtAuth, debugAuth, mymarker }
//console.log('module', module)
