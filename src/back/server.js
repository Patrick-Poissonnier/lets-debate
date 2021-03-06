
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const security = require('./security')
var cookieParser = require('cookie-parser')
const { corsOrigin } = require('./config/config')



const app = express()
app.use(cors({
  origin: [corsOrigin],
  credentials: true
}))
app.use(bodyParser.urlencoded({ extended: true }), bodyParser.json())
app.use(cookieParser())
app.use(security)

// Définition des CORS. Is it good ???
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', corsOrigin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE')
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, Accept, X-Requested-With, x-access-token, Content-Type, Access-Control-Request-Method',
    'Access-Control-Request-Headers')
  res.setHeader('Cache-Control', 'no-cache') // ???
  res.setHeader('preflightContinue', 'true')
  next()
})

require('./controllers/usersController.js')(app)
require('./controllers/messagesController.js')(app)

/* const UsersController = require('./controllers/usersController.js')
app.use('/user/login', UsersController.login)
app.use('/user/signup', UsersController.signup)
app.use('/user/getUserInfo', UsersController.getUserInfo)
 */
const port = 8800
app.listen(port, () => console.log(`Listening on port ${port}`))

require('./db_api').batch()
