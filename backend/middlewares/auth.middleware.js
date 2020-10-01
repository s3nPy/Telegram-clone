const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    if(!token) {
      throw new Error('Unauthorized')
    }

    const { userId } = jwt.verify(token, config.get('jwt.secret'))
    req.userId = userId
    
    const user = await User.findById(userId)
    if(!user) {
      throw new Error('User not found with this ID')
    }

  } catch (error) {
    return res.status(401).json({error: 'Unauthorized'})
  }

  return next()
} 

module.exports = auth 