/*
tuong tac voi mongoose theo 3 cach
[x] callback
[x]promises
[x]Async/await(la promises)
*/
const User = require('../models/User')
const Deck = require('../models/Deck')

const { JWT_SECRET } = require('../config/index')

const JWT = require('jsonwebtoken')

const encodedToken = (userID) => {
  return JWT.sign({
    iss: 'Tung Tran',
    sub: userID,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3)
  }, JWT_SECRET)
}

const Joi = require('@hapi/joi')
const idSchema = Joi.object().keys({
  userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

const authFacebook = async (req, res, next) => {
  const token = encodedToken(req.user._id)
  res.setHeader('Authozization', token)
  return res.status(200).json({ success: true })
}

const authGoogle = async (req, res, next) => {
  const token = encodedToken(req.user._id)
  res.setHeader('Authozization', token)
  return res.status(200).json({ success: true })
}

const getUser = async (req, res, next) => {
  const validatorResult = idSchema.validate(req.value.params)
  console.log(validatorResult)
  const { userID } = req.params
  const user = await User.findById(userID)
  return res.status(200).json(user)
}

const replaceUser = async (req, res, next) => {
  // enforce new user to old user
  const { userID } = req.value.params
  const newUser = req.value.body
  const result = await User.findByIdAndUpdate(userID, newUser)
  return res.status(200).json({ success: true })
}

const updateUser = async (req, res, next) => {
  //number of fields
  const { userID } = req.value.params
  const newUser = req.value.body
  const result = await User.findByIdAndUpdate(userID, newUser)
  return res.status(200).json({ success: true })
}

// Promises
// const getAllUser = (req, res, next) => {
//     User.find({}).then((users) => {
//         return res.status(200).json({ users })
//     }).catch(err => next(err))
// }

const getAllUser = async (req, res, next) => {
  const users = await User.find({})
  return res.status(200).json({ users })
}

// Promises
// const newUser = (req, res, next) => {
//     const newUser = new User(req.body)
//     newUser.save().then((user) => {
//         return res.status(200).json({ user })
//     }).catch(err => next(err))
// }

const newUser = async (req, res, next) => {
  const newUser = new User(req.value.body)
  await newUser.save()
  return res.status(201).json({ user: newUser })
}

const getUserDecks = async (req, res, next) => {
  const { userID } = req.value.params
  const user = await User.findById(userID).populate('decks')
  return res.status(200).json({ decks: user.decks })
}

const newUserDeck = async (req, res, next) => {
  const { userID } = req.value.params

  //Create a new deck
  const newDeck = new Deck(req.value.body)

  //Get user
  const user = await User.findById(userID)

  // Assign user as a deck's owner
  newDeck.owner = user

  //Save the deck
  await newDeck.save()
  //add deck to user's decks array 'decks'
  user.decks.push(newDeck)

  //Save user
  await user.save()

  return res.status(201).json({ deck: newDeck })
}

const signIn = async (req, res, next) => {
  //Assign a token
  const token = encodedToken(req.user._id)

  res.setHeader('Authozization', token)
  return res.status(200).json({ success: true })
}


const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.value.body

  //Check if user is a email the same
  const foundUser = await User.findOne({ email })
  console.log('foundUser', foundUser)
  if (foundUser) return res.status(401).json({ error: { message: 'Email is already is use' } })
  //Create a new user
  const newUser = new User({ firstName, lastName, email, password })
  console.log('new User', newUser)

  newUser.save()

  //Encode a token
  const token = encodedToken(newUser._id)

  res.setHeader('Authorization', token)

  return res.status(201).json({ success: true })
}



const secret = async (req, res, next) => {
  return res.status(200).json({ resources: true })
}

module.exports = {
  authFacebook,
  authGoogle,
  getAllUser,
  getUser,
  getUserDecks,
  newUser,
  newUserDeck,
  replaceUser,
  updateUser,
  signIn,
  signUp,
  secret,
}