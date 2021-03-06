const getMessage = require('./messages/getMessage.js')
const writeMessage = require('./messages/WriteMessage.js')
const getChildList = require('./messages/getChildList.js')

module.exports = function (app) {
  app.post('/messages/getMessage', getMessage.getMessage)
  app.post('/messages/getSubObj', getMessage.getSubObj)
  app.post('/messages/writeMessage', writeMessage.writeMessage)
  app.post('/messages/updateMessage', writeMessage.updateMessage)
//  app.post('/messages/updatePresentation', writeMessage.updatePresentation)
  app.post('/messages/getChildList', getChildList.getChildList)
}
