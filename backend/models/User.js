const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  avatar: {type: Buffer},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registeredAt: Date,

  chats: [{type: mongoose.Types.ObjectId, ref: 'Chat'}],
  contacts: [{type: mongoose.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('User', schema)