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
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
server.on('close', () => {
  console.log('Closing mongoose connection')
  mongoose.connection.close()
})

module.exports = {
  app, server
}
