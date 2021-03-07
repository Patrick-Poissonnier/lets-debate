const { User } = require('../../db_api')

const sanitizeHtml = require('sanitize-html')
const { configSanitzeHtml } = require('../../config/sanitizeParam')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')

const regPseudo = new RegExp('^([A-Za-z0-9_\\-\\. +_éèêàôûù])+$')

exports.signup = async (req, res) => {
  console.log(`signup : ${req.body.pseudo}`)
  const { email, password, pseudo, persist } = req.body
  if (!pseudo || !password) {
    return res.status(400).send('Requête invalide')
  }
  const user = {
    pseudo: pseudo,
    avatar: 'default.png',
    auth: 1, // droits utilisateur standard
    priv: {
      email: email,
      password: password
    }
  }
  if (!regPseudo.test(user.pseudo)) {
    return res.status(400).send('pseudo incorect')
  }
  try {
    const result = await User.create(user)
    if (user) {
      _sendResponse(res, result, persist)
    } else {
      return res.status(200).send('pseudo')
    }
  } catch (err) {
    return res.status(500).send('dbError')
  }
}

exports.update = async (req, res) => {
  console.log(`update : ${req.connectedUser.pseudo}`)
  const { email, password, presentation } = req.body
  if (!email && !password && !presentation) {
    return res.status(400).send('Requête invalide')
  }

  const user = { priv: {} }
  if (email) {
    user.priv.email = email
  }
  if (password) {
    user.priv.password = password
  }
  if (presentation) {
    user.presentation = sanitizeHtml(presentation, configSanitzeHtml)
  }

  if (!regPseudo.test(user.pseudo)) {
    return res.status(400).send('pseudo incorect')
  }

  try {
    const result = await User.update(req.connectedUser, user)
    res.status(200).send(result)
  } catch (err) {
    return res.status(400).send(err)
  }
}

exports.login = async (req, res) => {
  console.log(`login : ${req.body.pseudo}`)
  const { pseudo, password, persist } = req.body

  if (!(pseudo && password)) {
    return res.status(400).send('Requête invalide')
  }

  try {
    const result = await User.authenticate(pseudo, password)

    if (typeof result === "string") {
      return res.status(200).send(result)
    } else {
      _sendResponse(res, result, persist)
    }
  } catch (err) {
    console.log(err.toString)
    return res.status(500).send(toString(err))
  }
}
exports.resumeConnection = async (req, res) => {
  console.log(`resumeConnection : `)
  try {
    const result = await User.findOne(req.connectedUser, req.connectedUser.pseudo)
    _sendResponse(res, result, true)
  } catch (err) {
    console.log(err.toString)
    return res.status(500).send(toString(err))
  }
}
exports.logout = async (req, res) => {
  console.log(`logout : ${req.connectedUser.pseudo}`)
  _sendResponse(res)
}

function _sendResponse(res, user, persist) {
  const cookiesOptions = { domain: config.domain, httpOnly: true }
  let dataCookie = ''
  let data = {}

  if (user) {
    const accessToken = getToken(user)
    const token = accessToken.split('.')
    data = {
      userAccess: `${token[0]}.${token[1]}`,
      user: user,
      persist: persist
    }
    dataCookie = token[2]
    if (persist) {
      cookiesOptions.maxAge = 3600 * 24 * 365 * 1000 // 1an
    }
  } else {
    cookiesOptions.maxAge = 0
  }
  res.cookie('signature', dataCookie, cookiesOptions)
  return res.status(200).send(data)
}

function getToken(user) {
  return jwt.sign({
    pseudo: user.pseudo,
    //    id: user.id,
    auth: user.auth
  }, config.JWTsecret
  )
}
