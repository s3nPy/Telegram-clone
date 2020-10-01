const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  text: {type: String, required: true},
  timestamp: {type: Date, required: true},
  system: {type: Boolean},
  author: {type: mongoose.Types.ObjectId, ref: 'User'},
  chat: {type: mongoose.Types.ObjectId, ref: 'Chat', required: true}
})

module.exports = mongoose.model('Message', schema)