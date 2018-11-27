const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const blogsRouter = require('./controllers/blogs')

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms', { immediate: true }))
morgan.token('body', (req, res) => {
  return req.body ? JSON.stringify(req.body) : '{}'
})

app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)

// MongoDB connection
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.set('useNewUrlParser', true)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to database', process.env.MONGODB_URI)
  })
  .catch(err => {
    console.log(err)
  })

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
