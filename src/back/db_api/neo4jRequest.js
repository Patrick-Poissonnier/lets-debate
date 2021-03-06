module.exports = function neo4jRequest (driver) {

  function _decodeOneRecord (record) {
    if (!record || !record.length) {
      return null 
    }
    let row = record._fields[ 0].properties //record.get(0).properties
    let start = 1
    if( !row) {
      row = {}
      start = 0
    }
    
    for( let i=start; i< record.keys.length; i++) {
      const keyName = record.keys[ i]
      const object = record._fields[i]
      if (keyName === 'subObject') {
        object.forEach(elt => {
          if (elt.key) {
            row[elt.key.toLowerCase()] = elt.obj.properties || elt.obj
          } 
        })
      } else {
        row[keyName] = object  === null ? null :
          object.properties || object
      }
    }
    return row
  }

  function _decodeRecords (record) {
    const resultArray = []
    if( record) {
      record.records.forEach( row => {
        const res = _decodeOneRecord(row)
        resultArray.push(res)
      })
    }
    return resultArray
  }

  async function beginTransaction (write) {
    let stx= {}
    const param = {
      defaultAccessMode: write ? 'WRITE': 'READ'
    }
    stx.write = write
    stx.session = driver.session( param)
    stx.tx = await stx.session.beginTransaction()
    return stx
  }

  async function runRequest (stx, req, param) {
    const result = await stx.tx.run(req, param)
    return _decodeRecords(result)
  }

  async function closeTransaction (stx) {
    if (stx.write) {
      await stx.tx.commit()
    }
    await stx.session.close()
    stx = {}
  }
  async function rollBackTransaction (stx) {
    await stx.tx.rollback()
    await stx.session.close()
    stx = {}
  }

  async function readOneRow (req, param) {
    let result = null
    const session = driver.session()
    try {
      const record = await session.readTransaction(tx => tx.run(req, param))
        if (record) {
          if( record.records.length <= 1) {
            result = _decodeOneRecord(record.records[0])
          } else {
            return `readOneRow => mutiple rows : ${record.records.length}`
        }
      }
    } catch (err) {
      console.log(`readOneRow ${req} ${param} =>\n${err}`)
      return `readOneRow ${req} ${param} =>\n${err}`
    }
    session.close()
    return result
  }

  async function readMany (req, param) {
    let result = null
    const session = driver.session()
    try {
      const records = await session.readTransaction(tx => tx.run(req, param))
      result =  _decodeRecords(records)
    } catch (err) {
      console.log( `readMany ${req}; ${param} =>\n${err}`)
      return( `readMany ${req}; ${param} =>\n${err}`)
    }
    session.close()
    return result
  }

  async function writeOneRow (req, param) {
      let result = null
      const session = driver.session()
      try {
        const tx = await session.beginTransaction()
        const record = await tx.run(req, param)

        if (!record || record.records.length > 1) {
          await tx.rollback()
          return( `writeOneRow => mutiple rows : ${record? record.records.length: 0}`)
        } else {
          result = _decodeOneRecord(record.records[0])
          await tx.commit()
        }
      } catch (err) {
        console.log( `writeOneRow ${req}; ${param} =>\n${err}`)
        return( `writeOneRow ${req}; ${param} =>\n${err}`)
      }
      await session.close()
      return( result)
  }
  
  async function writeMany (req, param) {
    let result = null
    const session = driver.session()
    try {
      const tx = await session.beginTransaction()
      const record = await tx.run(req, param)
      result = _decodeRecords(record)
      await tx.commit()
    } catch (err) {
      console.log(`writeMany ${req}; ${param} =>\n${err}`)
      return `writeMany ${req}; ${param} =>\n${err}`
    }
    await session.close()
    return result
  }

  function initUID (nodeName) {
    let maxId = null
    const req = `MATCH (n: ${nodeName}) return max(n.id) AS maxID`
    const session = driver.session()
    session.readTransaction(tx => tx.run(req, { nodeName }))
    .then(result => {
      maxId = result.records[0].get(0)
      if (!maxId) maxId = 0
      console.log(`initUID : ${nodeName} ${maxId}`)
    })
    .finally(() => {
      session.close()
    })
    return function () {
      return ++maxId
    }
  }

  return {
    readOneRow,
    readMany,
    writeOneRow,
    writeMany,
    initUID,
    beginTransaction,
    runRequest,
    closeTransaction,
    rollBackTransaction
  }
}
