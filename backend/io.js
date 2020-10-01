const socketIO = require('socket.io')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('./models/User')
const Message = require('./models/Message')
const Chat = require('./models/Chat')

const clients = new Map()

const connection = socket => {
  // console.log('client has connected');

  socket.on('disconnecting', () => {
    // console.log('client has disconnected');
    clients.delete(socket.userId)
  })

  socket.on('authentication', async (token) => { 
    try {
      const {userId} = jwt.verify(token, config.get('jwt.secret'))
      const user = await User.findById(userId)
      user.chats.forEach(chatId => socket.join(chatId))
      
      socket.userId = userId.toString()
      clients.set(socket.userId, socket)
    } catch (error) {
      socket.disconnect()
    }
  })
}

const messageWatcher = io => {
  const changeStream = Message.watch()

  changeStream.on('change', async next => {
    try {
      if(next.operationType === 'insert') {
        const msg = await new Message(next.fullDocument)
          .populate({path: 'author', select: ['username', 'avatar']})
          .execPopulate()
        io.to(msg.chat).emit('message', msg)
      }
    } catch (error) {
      console.log('Error in messageWatcher:', error)
    }
  })
}

const chatWatcher = io => {
  const changeStream = Chat.watch({
    fullDocument: 'updateLookup'
  })

  changeStream.on('change', async next => {
    try {
      if(next.operationType === 'insert' || next.operationType === 'update') {
        if(next.operationType === 'update' && !next.updateDescription.updatedFields.members) {
          return
        }
        const chatId = next.fullDocument._id
        const members = next.fullDocument.members

        members.forEach( id => {
          const socket = clients.get(id.toString())
          if(socket) socket.join(chatId)
        })
        io.to(chatId).emit('chat_force_refresh', chatId)
      } else if(next.operationType === 'delete') {
        const chatId = next.documentKey._id
        io.to(chatId).emit('chat_deleted', chatId)
      }
    } catch (error) {
      console.log('Error in chatWatcher:', error)
    }
  })
}


module.exports = server => {
  const io = socketIO(server)

  io.on('connection', connection)

  const watch = mongoose => {
    messageWatcher(io)
    chatWatcher(io)
  }
  
  return { watch }
}