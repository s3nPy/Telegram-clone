const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('./io')(server)


const PORT = config.get('server.port') || 9000

app.use(cors( config.get('cors') ))
app.use(express.json())
app.use('/auth', require('./routers/auth.router'))
app.use('/chat', require('./routers/chat.router'))
app.use('/user', require('./routers/user.router'))


async function start() {
  try {
    await mongoose.connect(config.get('mongodb.url'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    io.watch()

    server.listen(PORT, () => {
      console.log(`Server is listening on localhost:${PORT}`)
    })
  } catch (error) {
    console.log('Error happend during startup:', error)
  }
}

start()