let widb    // = window.indexedDB
let db
let tables = []
//let version = 0
//let pseudo = ''

const get = function( table) {
  if( tables.indexOf( table) < 0) {
    return async function() { return null}
  } else {
    return async function (key) {
//      console.log(`idbGet ${table} ${key}`)
      return new Promise((resolve) => {
        try {
          let store = db.transaction(table).objectStore(table) 
          let req = store.get(key)
          req.onsuccess = function() {
            if(req.result) {
              resolve( req.result)
            } else {
              resolve( null)
            }  
          }
          req.onerror = function( err) {
            console.log(`idbGet${table} ${key} : req.onerror`)
            console.log( err)
            resolve( null)
          }
    
        } catch (err){ 
          console.log(`idbGet${table} ${key} : catch error`)
          console.log( err)
          resolve( null)
        }
      })
    }
  }

}
const set = function( table) {
  if( tables.indexOf( table) < 0) {
    return function() { return null}
  } else {
    return function ( data) {
//  console.log(`idbSet ${table} `)
//  console.log( data)
      try{
        let store = db.transaction(table, 'readwrite').objectStore(table)
        var req = store.put(data)
        req.onerror = function( err) {
          console.log(`idbSet ${table} ${data} :req.onerror`)
          console.log( err)
        }
      } catch (err) {
        console.log(`idbSet ${table} ${data} :catch`);
        console.log( err)
      }
    }
  }
}

async function init( _widb, version) {
  widb = _widb
  return new Promise((resolve, reject) => {
    let request
    if( !version) {
      request = widb.open("Debatons")
    } else {
      request = widb.open("Debatons", version)
    }

    request.onerror = function( err) {
      console.log('Database failed to open')
      console.log( err)
      reject( "open : onerror")
    }

    request.onsuccess = function() {
      console.log('Database opened successfully')
      tables = Object.values( request.result.objectStoreNames)
      db = request.result
      version = db.version
      resolve()
    }

    request.onupgradeneeded = function(event) {
      console.log( "onupgradeneeded")
      let db = event.target.result

      db.onerror = function(event) {
        console.log("onupgradeneeded: onerror")
        console.log( event)
        tables = null
        reject("onupgradeneeded : onerror")
      }

      try {
        tables = Object.values( request.result.objectStoreNames)
        if( tables.indexOf('Message') < 0) {
          db.createObjectStore( 'Message', { keyPath: 'id', autoIncrement: false });
        }
/*         if( tables.indexOf('User') < 0) {
          db.createObjectStore( 'User', { keyPath: 'pseudo', autoIncrement: false });
        } */
        if( tables.indexOf(`Connection`) < 0) {
          db.createObjectStore( `Connection`, { keyPath: 'pseudo', autoIncrement: false });
        }
      } catch( err) {
        console.log( err)
        reject("create Table")
      }
    }
  })
}

const indexedDB = { init, get, set} 
export default indexedDB 

