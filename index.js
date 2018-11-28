const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms', { immediate: true }))
morgan.token('body', (req, res) => {
  return req.body ? JSON.stringify(req.body) : '{}'
})

app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)

// MongoDB connection
mongoose.set('useNewUrlParser', true)
mongoose
  .connect(config.mongoUrl)
  .then(() => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch(err => {
    console.log(err)
  })

const server = http.createServer(app)
let serverRunning = false
console.log('before server.listen')
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
  serverRunning = true
  app.emit('app started')
})
server.on('close', () => {
  console.log('Closing mongoose connection')
  mongoose.connection.close()
})

const waitForServer = () => {
  if(serverRunning) {
    // Not sure if this is ever needed
    console.log('Server already running')
    return Promise.resolve(true)
  } else {
    console.log('Waiting for server')
    return new Promise(function(resolve) {
      console.log('server started')
      app.on('app started', resolve)
    })
  }
}

console.log('AAA')

module.exports = {
  app, server, waitForServer
}
