const { Vote } = require('../../db_api')

async function evaluate (req, res) {
  console.log('evaluat')
  console.log(req.body)

  let err = null
  if (req.connectedUser.auth < 1) {
    err = 'not connected'
  }
  const { messageId, evaluate, report, action } = req.body.data
  if (!messageId || typeof report !== 'number' || typeof evaluate !== 'number') {
    err = 'invalid data'
  }
  if( evaluate < 0 || evaluate > 4 || report < 0 || report > 5){
    err = 'invalid data'
  }
  if( ['evaluat', 'change', 'delete'].indexOf( action) === -1) {
    err = 'invalid data'
  }
  if( typeof err === 'string') {
    return res.status(400).send( err)
  }
  
  const message = await Vote.evaluate(req.connectedUser,
    messageId, evaluate, report, action )
  if (message) {
    return res.status(200).send(message)
  } else { 
    return res.status(200).send('erreur')
  }
}


module.exports = { evaluate }
