
function makeVerif (nodeType, dataAuth) {
  function verif (auth, obj, dataAuth) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        verif(auth, obj[key], dataAuth[key])
      } else if (!(dataAuth[key] && dataAuth[key] <= auth)) {
        console.log(`${nodeType}.verif : Sécurity error`)
        // throw (new Error(`${nodeType}.verif : Sécurity error`))  ou ecriture dans bd : UserModo
        return null
      } else {
        // TODO : controle des injections js
      }
    }
    return obj
  }
  return function (auth, obj) { // from front
    return verif(auth, obj, dataAuth)
  }
}

module.exports = {}
