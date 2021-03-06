// const utils = require('./utils')

module.exports = function message(refDBNodes) {
  const Neo4jRequest = refDBNodes.Neo4jRequest
  const getUID = Neo4jRequest.initUID('Message')

  // pour les données entrantes uniquement
  // 0: non connecté, 1 : utilisateur, 2: proprio, 3 admin
  /*  const dataAuth = {
    id: 1,
    titre: 1,
    resume: 1,
    text: 1,
    type: 3,
    minAuth: 3
  } */
  // const verif = utils.makeVerif('message', dataAuth) // from front to variable message

  const initText = {
    title: '',
    resume: '',
    text: '',
  }
  Object.freeze(initText)

  const initMessage = {
    version: 1,
    type: 0,
    minAuth: 0,
    nbResponse: 0,
    nbReport: 0,
    nbVote: 1,
    responseType: 4,
    report: [0, 0, 0, 0, 0],
    interest: [0, 0, 0, 0, 1],
    minInterest: 44,
    maxInterest: 89,
    minAgree: 44,
    maxAgree: 89
  }
  Object.freeze(initMessage)

  const createMessageReq = `
    MATCH (parent : Message { id: $propsMessage.parentId}),
      (author: User { pseudo: $propsMessage.authorPseudo})
    WHERE (author.auth > parent.minAuth)
    AND ( (apoc.bitwise.op( parent.type, '&', 2 ) <> 0)
      OR (author.auth > parent.minAuth+1) )
    OPTIONAL MATCH (parentVote: Vote {messageId: $propsMessage.parentId, userId: author.id})
    WITH parent, author, parentVote
      WHERE parentVote IS NOT null
      OR apoc.bitwise.op( parent.type, '&', 2 ) = 0
    CREATE ( message : Message $propsMessage),
      (myVote :Vote {userId: author.id, messageId: $propsMessage.id, pseudo: author.pseudo, vote:4}),
      (message) -[:PARENT]-> (parent),
      (message) -[:AUTHOR]-> (author),
      (message) -[:TEXT]-> (text $textMessage),
      (message) -[:SORTINTEREST]-> (:Sort {createNumber:0}),
      (message) -[:SORTAGREE]-> (:Sort {createNumber:0}),
      (message) -[:SORTDISAGREE]-> (:Sort {createNumber:0})
    SET 
      message.responseType = parentVote.vote,
      parent.nbResponse = parent.nbResponse +1,
      author.nbResponse = author.nbResponse +1
    RETURN message, text, myVote
  `
  const createMessageParam = {
    propsMessage: {},
    textMessage: {},
  }
  async function createMessage(author, message) {
    message.id = message.id || getUID()
    createMessageParam.textMessage = Object.assign({}, initText, message.text)
    delete (message.text)
    message.authorPseudo = author.pseudo
    createMessageParam.propsMessage = Object.assign({}, initMessage, message)
    const result = await Neo4jRequest.writeOneRow(createMessageReq, createMessageParam)
    return result
  }

  const readMessageReq = `
    MATCH (message: Message { id: $messageId}),
      (reader :User { pseudo: $readerPseudo})
    WHERE (reader.auth >= message.minAuth)
    RETURN message`

  const readMessageParam = {
    messageId: '',
    readerPseudo: '',
  }

  async function readMessage(reader, messageId, text) {
    readMessageParam.messageId = messageId
    readMessageParam.readerPseudo = reader.pseudo

    const result = await Neo4jRequest.readOneRow(readMessageReq, readMessageParam)
    return result
  }

  const readSubObjParam = {
    messageId: '',
    readerPseudo: '',
  }

  async function readSubObj(reader, messageId, sub) {
    readSubObjParam.messageId = messageId
    readSubObjParam.readerPseudo = reader.pseudo

    let req = `
    MATCH (message: Message { id: $messageId}),
      (reader :User { pseudo: $readerPseudo})
    WHERE (reader.auth >= message.minAuth)
    WITH message, reader
    `
    let endReq = ' RETURN message.version AS version'
    if (sub.indexOf('TEXT') >= 0) {
      req += ' MATCH (message) -[:TEXT]-> (text)'
      endReq += ', text'
    }
    if (sub.indexOf('MYVOTE') >= 0) {
      req += ' OPTIONAL MATCH (myVote :Vote {userId: reader.id, messageId: $messageId})'
      endReq += ', myVote'
    }
    req += endReq
    const result = await Neo4jRequest.readOneRow(req, readSubObjParam)
    return result
  }

  const updateMessageReq =
    `MATCH (message : Message { id: $messageId}),
      (updater : User {pseudo: $updaterPseudo}),
      (message) -[:AUTHOR]-> (author),
      (message) -[:TEXT]-> (text)
    WHERE (updater) = (author)
      OR (updater.auth > message.minAuth)
    SET text += $text,
      message += $message,
      message.version = message.version +1
    RETURN message`

  const updateMessageParam = {
    messageId: '',
    updaterPseudo: '',
    message: {},
    text: {},
  }
  async function updateMessage(updater, message) {
    updateMessageParam.messageId = message.id
    updateMessageParam.updaterPseudo = updater.pseudo
    updateMessageParam.text = message.text
    delete (message.text)
    updateMessageParam.message = message

    const result = await Neo4jRequest.writeOneRow(updateMessageReq, updateMessageParam)
    return result
  }

  const reqPart = [
    {},
    { link: 'SORTINTEREST', order: 'maxInterest desc' },
    { link: 'SORTAGREE', order: 'minAgree desc' },
    { link: 'SORTDISAGREE', order: 'maxAgree asc' }
  ]
  async function getChildList(reader, parentId, start, length, index) {
    const getChildListReq = `
      MATCH (parent : Message{ id: $parentId}) -[:${reqPart[index].link}]-> (sort)
        CALL apoc.do.when( sort IS NOT null AND parent.nbVote+ parent.nbResponse > sort.createNumber,
            " MATCH (parent) <-[:PARENT]- (message) 
              WITH message, sort, parent 
                ORDER BY message.${reqPart[index].order}
              WITH collect(id(message)) AS newList, sort, parent 
                SET sort= {
                  list: newList,
                  nbAccess: 1,
                  createTime: datetime(),
                  createNumber: parent.nbVote+ parent.nbResponse
                } 
              RETURN sort",
            " SET sort.nbAccess = sort.nbAccess+ 1
              RETURN sort",
            {sort: sort, parent: parent}
        ) YIELD value
        WITH sort.list[ $start .. $end] AS list
        UNWIND list AS idm
        MATCH (m: Message) WHERE id(m) = idm
        RETURN m
      `
    const result = await Neo4jRequest.writeMany(getChildListReq,
      {
        parentId,
        start,
        end: start + length,
      })
    if (result.length < length) {
      result.push(null)
    }
    return result
  }

  refDBNodes.Message = {
    createMessage,
    readMessage,
    readSubObj,
    updateMessage,
    getChildList,
  }
}
