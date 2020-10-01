const router = require('express').Router()
const auth = require('../middlewares/auth.middleware')
const upload = require('../middlewares/multer.middleware')
const {body, validationResult} = require('express-validator')
const User = require('../models/User')
const Chat = require('../models/Chat')


router.get('/refresh', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({ path: 'chats', populate: [
          {path: 'members', select: ['username', 'avatar']}, 
          {path: 'owner', select: 'username'},
          {path: 'messages', populate: [
            {path: 'author', select: ['username', 'avatar']}
          ]}
        ]
      })
      .populate({path: 'contacts', select: ['username', 'avatar']})

    user.password = undefined
    res.json(user)    
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later. ${error}`})
  }
})


const chatRefreshValChain = [
  body('chatId').exists().notEmpty()
]
router.post('/refresh/chat', auth, chatRefreshValChain, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({error: errors.array()})
    }
    
    const chat = await Chat.findById(req.body.chatId)
      .populate([
        {path: 'messages', populate: {
          path: 'author', select: ['username', 'avatar']
        }},
        {path: 'owner', select: 'username'},
        {path: 'members', select: ['username', 'avatar']}
      ])

    if(!chat) {
      return res.status(404).json({error: 'Chat with this id not found'})
    }

    const isMember = chat.members.find(m => m._id.toString() === req.userId.toString())
    if(!isMember) {
      return res.status(403).json({error: 'You aren\'t member'})
    }

    res.json(chat)    
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later. ${error}`})
  }
})


const addContactValChain = [
  body('username').exists().notEmpty()
]
router.post('/contact/add', auth, addContactValChain, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({error: errors.array()})
    }

    const contact = await User.findOne({username: req.body.username})
    if(!contact) {
      return res.status(404).json({error: `User ${req.body.username} is not existing!`})
    }

    const user = await User.findById(req.userId)
    if(user.username === contact.username) {
      return res.status(400).json({error: 'You can\'t add yourself :c'})
    }

    if(user.contacts.filter(c => c._id.toString() === contact._id.toString()).length) {
      return res.status(400).json({error: `${contact.username} already in your contacts`})
    }

    user.contacts.push(contact._id)
    await user.save()

    res.status(200).json({
      message: `${contact.username} successfully added!`,
      contact: {
        _id: contact._id, 
        username: contact.username,
        avatar: contact.avatar
      }
    })
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later.`})
  }
})


router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    user.avatar = req.file.buffer
    await user.save()

    res.json({message: 'Avatar successfully changed!', avatar: req.file.buffer})
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later.`})
  }
})

module.exports = router