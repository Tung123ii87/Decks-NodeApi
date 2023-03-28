const passport = require('passport')

const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local')
const FacebookTokenStrategy = require('passport-facebook-token')
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET, auth } = require('../config')
const User = require('../models/User')


//passport JWT
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)

    if (!user) return done(null, false)

    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))

//passport Facebook
passport.use(new FacebookTokenStrategy({
  clientID: auth.facebook.CLIENT_ID,
  clientSecret: auth.facebook.CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    //check user da ton tai chua
    const user = await User.findOne({
      authFacebookId: profile.id,
      authType: 'facebook'
    })

    if (user) return done(null, user)

    //If neww account
    const newUser = new User({
      authType: 'facebook',
      authFacebookId: profile.id,
      email: profile.emails[0].value,
      firstname: profile.name.givenName,
      lastName: profile.name.familiName,

    })

    await newUser.save()

    done(null, newUser)

  } catch (error) {
    done(error, false)
  }
}))

//passport Google
passport.use(new GooglePlusTokenStrategy({
  clientID: auth.google.CLIENT_ID,
  clientSecret: auth.google.CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    //check user da ton tai chua
    const user = await User.findOne({
      authGoogleId: profile.id,
      authType: 'google',
      firstname: profile.name.givenName,
      lastName: profile.name.familiName,
    })

    if (user) return done(null, user)

    //If neww account
    const newUser = new User({
      authType: 'google',
      authGoogleId: profile.id,
      email: profile.emails[0].value
    })

    await newUser.save()

    done(null, newUser)

  } catch (error) {
    done(error, false)
  }
}))

//passportLocal
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email })
    if (!user) return done(null, false)

    const isCorrectPassword = await user.isValidPassword(password)

    if (!isCorrectPassword) return done(null, false)
    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))