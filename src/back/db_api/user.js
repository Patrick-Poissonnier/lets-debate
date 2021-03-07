const passwordHash = require('password-hash')
//const utils = require('./utils')

module.exports = function (refDBNodes) {
  const Neo4jRequest = refDBNodes.Neo4jRequest
  const getUID = Neo4jRequest.initUID('User')

  // pour les données entrantes uniquement
  // 0: non connecté, 1 : utilisateur, 2: proprio, 3 moderateur, 4 admin
  /* const dataAuth = {
    id: 99,
    pseudo: 2,
    avatar: 2,
    auth: 3,
    priv: {
      email: 2,
      password: 2
    },
    message: 2
    //    modo: 3,
  }
  Object.freeze(dataAuth)
  const verif = utils.makeVerif('user', dataAuth) // from front => Object
 */
  const initUser = {
    avatar: "default.png",
    auth: 1,
    nbReport: 0,
    nbVote: 1,
    nbResponse: 0,
    interest: [0, 0, 1],
    report: [0, 0, 0, 0, 0],
    minInterest: 44,
    maxInterest: 89,
  }
  Object.freeze(initUser)

  const createReq =
    `CREATE (user : User $pubProps) -[:PRIVATE]-> (private : PrivateUser $privProps),
    (user) -[:TEXT]-> (:Text {text:''})
  SET user.id = toInteger( user.id), user.auth = toInteger( user.auth)
  RETURN user, private`

  const createParam = {
    pubProps: {},
    privProps: {},
  }

  async function create(user) {
    createParam.privProps = user.priv
    delete (user.priv)
    createParam.pubProps = Object.assign({}, initUser, user)
    createParam.pubProps.id = createParam.privProps.id = user.id || getUID()

    createParam.privProps.passwordLength = createParam.privProps.password.length
    createParam.privProps.password =
      passwordHash.generate(createParam.privProps.password)

    const result = await Neo4jRequest.writeOneRow(createReq, createParam)
    //    refDBNodes.Message.createPresentation()
    //    const userOut = read(result)
    return formatResult(result)
  }

  const findOneReq = `
    MATCH( user: User {pseudo : $pseudo})
    OPTIONAL MATCH (user) -[r]-> (sub) 
    WHERE type(r) in $sub
    RETURN user, collect({key:type(r), obj: sub}) AS subObject
  `
  const findOneParam = {
    pseudo: '',
    sub: []
  }
  async function findOne(reader, pseudo, text) {

    findOneParam.pseudo = pseudo
    findOneParam.sub = []

    if (reader.auth >= 2) {
      findOneParam.sub.push('MODO')
    }
    if (reader.pseudo === pseudo) {
      findOneParam.sub.push('PRIVATE')
    }
    if (text) {
      findOneParam.sub.push('TEXT')
    }
    const result = await Neo4jRequest.readOneRow(findOneReq, findOneParam)
    return formatResult(result)
  }

  const updateReq = `
  MATCH (user :User {pseudo: $pseudo}) -[:PRIVATE]-> (private :PrivateUser),
    (user) -[:TEXT]-> (text :Text)
  SET private += $privProps,
    user += $pubProps,
    text += $text
  RETURN user, private, text
  `
  const updateParam = {
    pseudo: '',
    pubProps: {},
    privProps: {},
    text: {},
  }

  async function update(user, data) {
    updateParam.privProps = {}
    if (data.priv) {
      if (data.priv.password) {
        updateParam.privProps.passwordLength = user.priv.password.length
        updateParam.privProps.password = passwordHash.generate(user.priv.password)
      }
      if (data.priv.email) {
        updateParam.privProps.email = data.priv.email
      }
      delete data.priv
    }

    if (typeof data.presentation === 'string') {
      updateParam.text = { text: data.presentation }
    } else {
      updateParam.text = {}
    }
    delete data.presentation
    updateParam.pubProps = data
    updateParam.pseudo = user.pseudo
    const result = await Neo4jRequest.writeOneRow(updateReq, updateParam)
    return formatResult(result)
  }

  function formatResult(result) {
    delete result.id
    if (result && result.private) {
      delete result.private.password
    }
    if (result.text) {
      result.presentation = result.text.text
      delete result.text
    }
    return result
  }

  async function authenticate(pseudo, password) {
    console.log(`authenticate : ${pseudo}`)

    findOneParam.pseudo = pseudo
    findOneParam.sub = ['PRIVATE']
    const result = await Neo4jRequest.readOneRow(findOneReq, findOneParam)
    if (result) {
      const bdPassword = result.private.password
      delete result.private.password
      if (passwordHash.verify(password, bdPassword)) {
        return result
      } else return ('password')
    } else return ('pseudo')
  }

  refDBNodes.User = {
    findOne, create, update, authenticate
  }
}
