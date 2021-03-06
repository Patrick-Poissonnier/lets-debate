
const { Message } = require('../../db_api')

exports.getMessage = async function  (req, res) {
  console.log('getMessage'); console.log(req.body)
  const { id, content} = req.body
  if ( !id) {
    return res.status(400).send( 'Requête invalide')
  }

  let sub = []
  if( content === 'full') {
    sub = ['AUTHOR', 'TEXT']
  } 
  try {
    message = await Message.readMessage(req.connectedUser, id, sub)
    if (!message) {
      return res.status(401).send( 'Le message n\'existe pas' )
    } else {
      return res.status(200).send( {message: message })
    }
  } catch (err) { 
    console.log(err) 
    return res.status(500).send("internal error")
  }
}

exports.getSubObj = async function  (req, res) {
  console.log('getSubObj'); console.log(req.body)
  const { id, content} = req.body
  if ( !id || !content) {
    return res.status(400).send( 'Requête invalide')
  }

  try {
    message = await Message.readSubObj(req.connectedUser, id, content)
    if (!message) {
      return res.status(401).send( 'Le message n\'existe pas' )
    } else {
      return res.status(200).send( {message: message })
    }
  } catch (err) { 
    console.log(err)
    return res.status(500).send("internal error")
  }
}


