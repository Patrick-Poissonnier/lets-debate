const sanitizeHtml = require('sanitize-html')
const { configSanitzeHtml} = require( '../../config/sanitizeParam')
const { Message } = require('../../db_api')

exports.writeMessage= async (req, res) => {
  console.log('writeMessage'); console.log(req.body)

  const { message } = req.body
  if( !message) {
    return res.status(400).send( 'Requête invalide')
  }
    const verified = _verifMessage(req.connectedUser, message)
    if( !verified) {
      return res.status(404).send( 'non autorisé')
    }

    verified.type = verified.type || 15
    try {
      const respMessage = await Message.createMessage(
      req.connectedUser,
      verified
    )
    return res.status(200).send( respMessage)
  } catch (err) { 
    console.log(err) 
    return res.status(500).send( err.toString())
  }
}

exports.updateMessage= async (req, res) => {
  console.log('updateMessage'); console.log(req.body)

  const { message } = req.body
  if( !message) {
    return res.status(400).send( 'Requête invalide')
  }
  const verified = _verifMessage(req.connectedUser, message)
  if( !verified) {
    return res.status(404).send( 'non autorisé')
  }
  try {
    const respMessage = await Message.updateMessage(
      req.connectedUser,
      verified
    )
    return res.status(200).send( respMessage)
   } catch (err) { 
    console.log(err)
    return res.status(500).send( err.toString())
  } 
}

function _verifMessage (author, message) {
  let verified = {
    text: {},
    parentId: message.parentId,
  }
  message.text = message.text || {}

  if( author.auth === 1) {
    verified.text.title = typeof message.text.title === 'string' ?
      sanitizeHtml(message.text.title, {}) : undefined
    verified.text.resume = typeof message.text.resume === 'string' ?
      sanitizeHtml(message.text.resume, {}) : undefined
    verified.text.text = typeof message.text.text === 'string' ?
      sanitizeHtml(message.text.text, configSanitzeHtml) : undefined

  } else if( author.auth > 1) {
    verified.text.title = typeof message.text.title === 'string' ?
      sanitizeHtml(message.text.title, configSanitzeHtml) : undefined
    verified.text.adminText = typeof message.text.adminText === 'string' ?
      sanitizeHtml(message.text.adminText, configSanitzeHtml) : undefined
    verified.text.resume = typeof message.text.resume === 'string' ?
      sanitizeHtml(message.text.resume, configSanitzeHtml) : undefined
    verified.text.text = typeof message.text.text === 'string' ?
      sanitizeHtml(message.text.text, configSanitzeHtml) : undefined

    verified.type = message.type
    verified.id = message.id
  }
  return verified
}
