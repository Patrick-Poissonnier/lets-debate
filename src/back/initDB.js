const { Neo4jRequest, User, Message, closeDriver } = require('./db_api')

init().then(() => { closeDriver() })

async function init() {
  let result
  try {
    result = await Neo4jRequest.readOneRow(
      "match (n) return count(n) as nb"
      , {}
    )
    if (!result) throw 'DB Error on count nodes'
    if (result.nb) {
      throw `DB isn't empty : nodes exists \n initDB aborted`
    }

    result = await Neo4jRequest.readMany(
      "CALL db.indexes()"
      , {}
    )
    if (result) {
      //            throw `DB isn't empty : indexes exists \n initDB aborted`
    }
    await Neo4jRequest.writeOneRow(` 
            CREATE INDEX idVote IF NOT EXISTS FOR (n:Vote) ON ( n.messageId, n.userId)`, {})
    //        await Neo4jRequest.writeOneRow( `
    //            CREATE INDEX idMessage IF NOT EXISTS FOR (n:Message) ON ( n.fatherId)`, {} )
    await Neo4jRequest.writeOneRow(`
            CREATE CONSTRAINT ctUser IF NOT EXISTS ON (n:User) ASSERT n.pseudo IS UNIQUE`, {})
    await Neo4jRequest.writeOneRow(`
            CREATE CONSTRAINT ctPrivateUser IF NOT EXISTS ON (n:PrivateUser) ASSERT n.id IS UNIQUE`, {})
    await Neo4jRequest.writeOneRow(`
            CREATE CONSTRAINT ctMessage IF NOT EXISTS ON (n:Message) ASSERT n.id IS UNIQUE`, {})
    await Neo4jRequest.writeOneRow(`
            CREATE INDEX sortDate IF NOT EXISTS FOR (s:Sort) ON ( s.createDate)`, {})

    result = await Neo4jRequest.writeOneRow(`
            create (n: User {id:0, pseudo:'none', auth:0}),
                (m: Message {id:0, type:0, minAuth: 0} )
                return 0 as null
            `, {}
    )       // ? : (v: Vote { userId:1, messageId:0, vote:0, report:0, pseudo:'admin'})


    const user = {
      id: 1,
      pseudo: "admin",
      auth: 100,
      avatar: 'admin-100.png',
      priv: {
        password: 'admin'
      }
    }
    result = await User.create(user)

    let message = {
      id: 1,
      parentId: 0,
      type: 16,
      text: {
        title: "<p>Texte d'accueil</p>",
        text: "votre texte"
      }
    }
    result = await Message.createMessage({ pseudo: 'admin' }, message)

    message = {
      id: 2,
      parentId: 0,
      type: 15,
      text: {
        title: '<p>1° discution</p>'
      }
    }
    result = await Message.createMessage({ pseudo: 'admin' }, message)

    result = await Neo4jRequest.readOneRow(
      "match (n) return count(n) as nb"
      , {}
    )
    if (!result) throw 'DB Error on count nodes'
    if (result.nb !== 17) {
      throw `BUG in initDB \nnodes created : ${result.nb} expected : 16`
    }
    console.log("initDB finished correctely")
  } catch (err) {
    console.log(err)
  }
}


