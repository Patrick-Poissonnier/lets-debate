const account = require('./users/account.js')
const users = require('./users/userlib.js')
const evaluate = require('./votes/evaluate.js')

var multer  = require('multer')
var upload = multer()     //{ dest: '../front/public/Avatar/' }

module.exports = function (app) {
  app.post('/user/signup', account.signup)
  app.post('/user/login', account.login)
  app.post('/user/logout', account.logout)
  app.post('/user/resumeConnection', account.resumeConnection)
  app.post('/user/update', account.update)
  app.post('/user/getUser', users.getUser)
  app.post('/user/newAvatar', upload.single('avatar'), users.newAvatar)
  app.post('/vote/evaluat', evaluate.evaluate)
}
