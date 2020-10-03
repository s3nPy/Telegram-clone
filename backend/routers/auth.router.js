const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const Chat = require('../models/Chat')

// const COMMON_CHAT_ID = config.get('mongodb.commonChatId')

const authValChain = [
  body('username').exists().isLength({min: 5, max: 20}),
  body('password').exists().isLength({min: 6, max: 24})
]

router.post('/login', authValChain, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({error: errors.array()})
    }

    const user = await User.findOne({username: req.body.username})
    if(!user) {
      return res.status(404).json({error: 'Such user doesn\'t exist'})
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if(!isMatch) {
      return res.status(400).json({error: 'Wrong password'})
    }

    const token = jwt.sign(
      {userId: user._id},
      config.get('jwt.secret')
    )
    
    return res.status(200).json({token})
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later.`})
  }
})

router.post('/register', authValChain, async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({error: errors.array()})
    }
    
    const isExist = await User.findOne({username: req.body.username})
    if(isExist) {
      return res.status(409).json({error: 'Such user already exists'})
    }

    const passwordHash = await bcrypt.hash(req.body.password, 14)
    const user = await User.create({
      username: req.body.username,
      password: passwordHash,
      // chats: [COMMON_CHAT_ID]
    })

    // // add member to the common chat
    // const chat = await Chat.findById(COMMON_CHAT_ID)
    // chat.members.push(user._id)
    // await chat.save()

    const token = jwt.sign(
      {userId: user._id},
      config.get('jwt.secret')
    )
    
    return res.status(201).json({token})
  } catch (error) {
    res.status(500).json({error: `Internal error has happened. Retry later.`})
  }
})


module.exports = router
