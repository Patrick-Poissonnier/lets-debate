
const {dbBatchSort } = require('../config/config.js')

module.exports = function batch( Neo4jRequest) {

  return function() {
    const clearSortReq = `
      WITH datetime() AS date
      MATCH (sort :Sort)
      WHERE sort.createTime < date - DURATION( '${dbBatchSort.ttlSort}')
      CALL apoc.do.when( sort.nbAccess <= ${dbBatchSort.minSortAccess},
        'set sort = {createNumber:0} RETURN sort',
        'set sort += {nbAccess: 0, createTime: date}',
        {sort: sort, date:date}
      ) YIELD value
      RETURN count(value) AS nbCleared
      `

      setInterval( async () => {
        Neo4jRequest.writeOneRow(clearSortReq, {})
        .then( result => {
          console.log( 'batchSort '+ result.nbCleared)
        })
        .catch( err=>{
          console.log( err)
        })
      }, dbBatchSort.batchFrequency*1000
    )
  }
}