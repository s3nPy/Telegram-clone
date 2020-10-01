const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String},
  private: {type: Boolean, default: false},
  owner: {type: mongoose.Types.ObjectId, ref: "User", required: true},
  members: [{type: mongoose.Types.ObjectId, ref: "User"}],
  messages: [{type: mongoose.Types.ObjectId, ref: "Message"}]
})

module.exports = mongoose.model('Chat', schema)