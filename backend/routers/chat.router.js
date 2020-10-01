const router = require('express').Router()
const {body, validationResult} = require('express-validator')
const auth = require('../middlewares/auth.middleware')
const Chat = require('../models/Chat')
const User = require('../models/User')
const Message = require('../models/Message')

const createValChain = [
  body('title').exists().isLength({min: 3, max: 24}),
  body('description').optional().isLength({max: 64})
]
router.post('/create', auth, createValChain, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({error: errors.array()})
    }

    let chat = await Chat.create({
      title: req.body.title,
      description: req.body.description,
      owner: req.userId,
      members: [req.userId]
    })

    // this made just to send created chat back to the client
    chat = await chat.populate([
      {path: 'members', select: 'username'},
      {path: 'owner', select: 'username'}
    ]).execPopulate()

    const user = await User.findById(req.userId)
    user.chats.push(chat._id)
    await user.save()

    res.status(201).json({
      message: `Chat ${req.body.title} created`,
      chat
    })
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later.`})
  }
})


const createPrivateValChain = [
  body('username').exists().notEmpty()
]
router.post('/create/private', auth, createPrivateValChain, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({error: errors.array()})
    }

    const user = await User.findById(req.userId)
    if(!user) {
      res.status(404).json({error: 'User not found'})
    }

    const secondUser = await User.findOne({username: req.body.username}) 
    if(!secondUser) {
      res.status(404).json({error: 'Second user not found'})
    }

    const isContact = user.contacts.find(c => c._id.toString() === secondUser._id.toString())
    if(!isContact) {
      res.status(400).json({error: 'Second user isn\'t in your contacts'})
    }

    // find special private chat or create new one
    const title =  [user._id.toString(), secondUser._id.toString()].sort().join('')
    let chat = await Chat.findOne({title, private: true})
    if(chat) {
      for(let u of [user, secondUser]) {
        const isIncluded = u.chats.find(c => c._id.toString() === chat._id.toString())
        if(!isIncluded) {
          u.chats.push(chat._id)
          await u.save()
        }
      }
      return res.json({message: `Chat ${req.body.title} found`, chat})
    }

    chat = await Chat.create({
      title, private: true,
      members: [user._id, secondUser._id],
      owner: user._id
    })

    user.chats.push(chat._id)
    await user.save()
    
    secondUser.chats.push(chat._id)
    await secondUser.save()
    
    res.status(201).json({message: `Chat ${req.body.title} created`, chat})
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later.`})
  }
})


const sendValChain = [
  body('text').exists().trim().notEmpty(),
  body('chatId').exists().isString()
]
router.post('/send', auth, sendValChain, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({error: errors.array()})
    }

    const chat = await Chat.findById(req.body.chatId)
      .populate({path: 'members', select: 'username'})
    if(!chat) {
      return res.status(404).json({error: 'Chat not found'})
    }

    const user = chat.members.find(m => m._id.toString() === req.userId)
    if(!user) {
      return res.status(403).json({error: 'User is not in this chat'})
    }

    const message = await Message.create({
      text: req.body.text,
      timestamp: new Date(),
      author: user._id,
      chat: chat._id
    })

    chat.messages.push(message._id)

    await (await chat.depopulate().execPopulate()).save()
    res.status(201).json({message: 'message created'})
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later.`})
  }
})


const inviteValChain = [
  body('username').exists().trim().notEmpty(),
  body('chatId').exists().isString()
]
router.post('/invite', auth, inviteValChain, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({error: errors.array()})
    }

    const chat = await Chat.findById(req.body.chatId)
      .populate({path: 'members', select: 'username', populate: {
        path: 'contacts', select: 'username'
      }})
    if(!chat) {
      return res.status(404).json({error: 'Chat not found'})
    }

    if(chat.private) {
      return res.status(403).json({error: 'You can\'t invite in private chat'})
    }

    const owner = chat.members.find(m => {
      return m._id.toString() === req.userId.toString()
            && m._id.toString() === chat.owner._id.toString()
    })
    if(!owner) {
      return res.status(403).json({error: 'You aren\'t owner of this chat'})
    }

    const user = await User.findOne({username: req.body.username})
    if(!user) {
      return res.status(404).json({error: 'Such user doesn\'t exist'})
    }

    const isInContacts = owner.contacts.find(c => c._id.toString() === user._id.toString())
    if(!isInContacts) {
      return res.status(403).json({error: 'User isn\'t in your contacts'})
    }

    const isInvited = chat.members.find(m => m._id.toString() === user._id.toString())
    if(isInvited) {
      return res.status(400).json({error: 'User is already invited'})
    }
    
    user.chats.push(chat._id)
    await user.save()

    const message = await Message.create({
      text: `${user.username} has joined the chat`,
      timestamp: new Date(),
      system: true,
      chat: chat._id
    })

    await chat.depopulate().execPopulate()
    chat.members.push(user._id)
    chat.messages.push(message._id)
    await chat.save()
  

    res.status(200).json({message: 'user invited', user: {
      _id: user._id,
      username: user.username,
      avatar: user.avatar
    }})
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later. ${error}`})
  }
})


const leaveValChain = [
  body('chatId').exists().isString()
]
router.post('/leave', auth, leaveValChain, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({error: errors.array()})
    }

    const chat = await Chat.findById(req.body.chatId)
    if(!chat) {
      return res.status(404).json({error: 'Chat not found'})
    }

    if(chat.private) {
      return res.status(403).json({error: 'You can\'t leave from private chat'})
    }

    const user = await User.findById(req.userId)
    if(!user) {
      return res.status(404).json({error: 'Such user doesn\'t exist'})
    }

    const isMember = chat.members.find(m => m.toString() === user._id.toString())
    if(!isMember) {
      return res.status(404).json({error: 'User isn\'t member of this chat'})
    }

    const message = await Message.create({
      text: `${user.username} has left the chat`,
      timestamp: new Date(),
      system: true,
      chat: chat._id
    })

    chat.messages.push(message._id)
    chat.members = chat.members.filter(id => id.toString() !== user._id.toString())
    user.chats = user.chats.filter(id => id.toString() !== chat._id.toString())
    
    await chat.save()
    await user.save()

    res.status(200).json({message: 'Successfully left the chat'})
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later. ${error}`})
  }
})


const deleteValChain = [
  body('chatId').exists().isString()
]
router.post('/delete', auth, deleteValChain, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({error: errors.array()})
    }

    const chat = await Chat.findById(req.body.chatId)
    if(!chat) {
      return res.status(404).json({error: 'Chat not found'})
    }

    if(chat.private) {
      return res.status(403).json({error: 'You can\'t delete private chat'})
    }

    if(chat.owner.toString() !== req.userId.toString()) {
      return res.status(400).json({error: 'You ain\'t owner of this chat'})
    }

    // remove chat from users
    for(let id of chat.members) {
      const user = await User.findById(id)
      user.chats = user.chats.filter(c => c._id.toString() !== chat._id.toString()) 
      await user.save()
    }

    // remove all messages
    for(let id of chat.messages) {
      const msg = await Message.findById(id)
      await msg.remove()
    }

    await chat.remove()    

    res.status(200).json({message: 'Chat has been deleted'})
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later. ${error}`})
  }
})

module.exports = router