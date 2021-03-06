const { User } = require('../../db_api')

async function getUser (req, res) {
  console.log('getUser'); console.log(req.body)
//  console.log(req.connectedUser)

  const { pseudo, text } = req.body
  if (!pseudo) {
    return res.status( 400).send('invalid data')
  }
  try {
    const user = await User.findOne( req.connectedUser, pseudo, text)
//    console.log(user)
    if( user) {
      return res.status( 200).send( user )
    } else {
      return res.status( 400).send('not found')
    }
  } catch (err) {
    console.log(err)
    return res.status( 500).send( err.toString())
  }
}

const fs = require('fs');

async function newAvatar( req, res) {
  console.log('newAvatar');
//  console.log(req.connectedUser)
  if (req.connectedUser.auth < 1) {
    return res.status( 400).send( 'not connected')
  }
  if( !req.file) {
    return res.status( 400).send( 'no data')
  }

  fs.writeFile(`../front/public/Avatar/${req.connectedUser.pseudo}.jpeg`, req.file.buffer, async (err) => {
    if (err) {
        console.log('Error: ', err);
        res.status(500).send('An error occurred: ' + err);
    } else {
      const user = await User.update( req.connectedUser, {avatar: `${req.connectedUser.pseudo}.jpeg`})
      return res.status( 200).send( user )
    }
  })
}
module.exports = {getUser, newAvatar }
