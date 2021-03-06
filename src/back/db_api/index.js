const neo4j = require('neo4j-driver')
const { neo4jConnexion } = require('../config/config')

const driver = neo4j.driver(neo4jConnexion.url,
  neo4j.auth.basic(neo4jConnexion.login, neo4jConnexion.pwd),
  { disableLosslessIntegers: true }
)
const Neo4jRequest = require('./neo4jRequest.js')(driver)

const refDBNodes = { // pour les références circulaires
  Neo4jRequest: Neo4jRequest, 
  User: {},
  Message: {},
  Vote: {}
}

require('./User.js')(refDBNodes)
require('./Message.js')(refDBNodes)
require('./Vote.js')(refDBNodes)

const batch = require('./Batch.js')( Neo4jRequest)    

async function closeDriver() {
  await driver.close()
}

module.exports = {
  ...refDBNodes, closeDriver, batch
}
