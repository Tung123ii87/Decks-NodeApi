const express = require('express')
const router = require('express-promise-router')()

const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')

const passport = require('passport')
const passportConfig = require('../middlewares/passport')

const UserController = require('../controller/user')
const { ValidationError } = require('@hapi/joi/lib/errors')

router.route('/auth/google').post(passport.authenticate('google-plus-token', { session: false }), UserController.authGoogle)
router.route('/auth/facebook').post(passport.authenticate('facebook-token', { session: false }), UserController.authFacebook)

router.route('/signup').post(validateBody(schemas.authSignUpSchema), UserController.signUp)

router.route('/signin').post(validateBody(schemas.authSignInSchema), passport.authenticate('local', { session: false }), UserController.signIn)

router.route('/secret').get(passport.authenticate('jwt', { session: false }), UserController.secret)


router.route('/')
  .get(UserController.getAllUser)
  .post(validateBody(schemas.userSchema), UserController.newUser)

router.route('/:userID')
  .get(validateParam(schemas.idSchema, 'userID'), UserController.getUser)
  .put(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchema), UserController.replaceUser)
  .patch(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userOptionalSchema), UserController.updateUser)

router.route('/:userID/decks')
  .get(validateParam(schemas.idSchema, 'userID'), UserController.getUserDecks)
  .post(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.deckSchema), UserController.newUserDeck)
module.exports = router