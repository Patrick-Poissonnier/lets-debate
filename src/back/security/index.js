const jwt = require('jsonwebtoken')
const config = require('../config/config')

const checkJWT = function (req, res, next) {
  const userAccess = req.headers.useraccess
  const signature = req.cookies && req.cookies.signature

//  let token = ''
  let connectedUser
  if (!userAccess && !signature) {
    connectedUser = {
      id: 0,
      pseudo: 'none',
      auth: 0
    }
  } else {
    const token = `${userAccess}.${signature}`
    try {
      connectedUser = jwt.verify(token, config.JWTsecret)
    } catch (err) {
      console.log('invalid token ')
      const cookiesOptions = { 
        domain: 'localhost', 
        httpOnly: true,
        maxAge: 0,
       }
      res.cookie('signature', '', cookiesOptions)
      return res.status(403).send( 'invalid token!')
    }
  }
  req.connectedUser = connectedUser
//  res.accessToken = token
  next()
}

module.exports = checkJWT
