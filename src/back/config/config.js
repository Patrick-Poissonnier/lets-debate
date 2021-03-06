module.exports = {
  corsOrigin: 'http://localhost:8080',
  ...require('./secret'),
  dbBatchSort: {    // convert cpu load <=> disque space
    ttlSort: 'PT24H',    // min duration for node (:Sort). In neo4j format 
    minSortAccess: 2,   // min access to stay alive
    batchFrequency: 3600 // = 1h in secondes
  }
}

/* ./secret.js :
  module.exports = {
    JWTsecret: '',
    neo4jConnexion: { url: '', login: '', pwd: '' }
  }
*/
