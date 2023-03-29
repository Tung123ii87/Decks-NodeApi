//Config env
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const secureApp = require('helmet')
const { use } = require('./routers/user')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { engine } = require('express-handlebars')

// Setup connect mongobd by mongoose
mongoose.connect('mongodb://127.0.0.1:27017/nodejsapi')
  // mongoose.connect('mongodb+srv://nodeapi:16825ds5230@nodeapi.8f9nizj.mongodb.net/test')
  .then(() => console.log('Connect success DB'))
  .catch((error) => console.error(`Connect false DB ${error}`))

const app = express()

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(secureApp())

const userRoute = require('./routers/user')
const deckRoute = require('./routers/deck')

//Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())

//Router
app.use('/users', userRoute)
app.use('/decks', deckRoute)

//Routers
app.get('/', (req, res, next) => {
  return res.status(200).json({
    msg: 'Collect success'
  })
})

//Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

//Error handler function
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {}
  const status = err.status || 500

  //res to client
  return res.status(status).json({
    error: {
      message: error.message
    }
  })
})

//Start th server
const port = app.get('port') || 3000
app.listen(port, () => console.log(`Server listening on ${port}`))