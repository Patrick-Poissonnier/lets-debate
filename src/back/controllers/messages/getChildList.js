const { Message } = require('../../db_api')

exports.getChildList = async function (req, res) {
  console.log('getChildList'); console.log(req.body)

  let { parentId, start, index} = req.body
  if( !parentId || typeof start !== "number"
      || typeof index !== "number" || index<1 || index >3) {
    return res.status(400).send( 'Requête invalide')
  }
  
  start = Math.max(0, start)
  const length = 10
  
  try {
    const listMessage = await Message.getChildList(
      req.connectedUser,
      parentId, start, length, index
    ) 
    return res.status(200).send( {list: listMessage })
  } catch (err) {
    console.log(err)
    return res.status(500).send( 'Internal Error')
  }
}

