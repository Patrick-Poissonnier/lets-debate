//const utils = require('./utils')

module.exports = function vote (refDBNodes) {
  const neo4jRequest = refDBNodes.Neo4jRequest
 
/*  WIDTH vote, oldVote
  CALL apoc.do.when( oldVote IS NOT null,
    'CREATE (vote) -[:OLDVOTE]-> (oldVote)',
    '',
    {oldVote: oldVote, vote:vote}) 
    YIELD value WITH value AS ignored, oldVote, vote
*/
    
  const aiNoInterest= 1  //indices for array Interest
  const aiInterest = 2
  const aiDisagree = 3
  const aiAgree = 4
  
  function minMax ( total, positif) {
    let res = {}
    if( positif === total) {
      res = {min: Math.pow( 0.2, 1/(total+1)), max: Math.pow( 0.8, 1/(total+1)) }
    } else if( positif === 0) {
      res = {min: 1-Math.pow( 0.8, 1/(total+1)), max: 1-Math.pow( 0.2, 1/(total+1)) }
    } else {
      const pr = positif / total;
      const ep = 0.8417*Math.sqrt( pr*(1-pr)/total) // estimateur à +/- 30% => p20, p80
      res = {min: pr - ep, max: pr + ep}
    } 
    return { min: Math.round( res.min*100), max: Math.round( res.max*100)}
  }

  function add( sens, message, author, evaluat, report) {
    if( evaluat) {
      message.nbVote += sens
      message.interest[ evaluat] += sens
      author.nbVote += sens
      author.interest[ Math.min( evaluat, 2)] += sens
    }
    if( report) {
      message.nbReport += sens
      message.report[ report] += sens
      author.nbReport += sens
      author.report[ report] += sens
    }
  }  

  function newStat( message, author) {
    let mm = minMax( message.nbVote, message.nbVote - message.interest[ aiNoInterest])
    message.minInterest = mm.min
    message.maxInterest = mm.max

    mm = minMax( message.interest[ aiAgree] + message.interest[ aiDisagree]
        , message.interest[ aiAgree])
    message.minAgree = mm.min
    message.maxAgree = mm.max

    mm = minMax( author.nbVote, author.interest[ aiInterest])
    author.minInterest = mm.min
    author.maxInterest = mm.max
  }

  const voteReadReq = `
    MATCH (message :Message { id: $messageId})
      -[:AUTHOR]-> (author :User),
      (user :User {pseudo: $pseudo})
    OPTIONAL MATCH (myVote :Vote {messageId: $messageId, userId: user.id})
    RETURN 
      id( message) AS idMessage,
      id( author) AS idAuthor,
      message,
      author,
      user,
      myVote
  `
  const voteReadParam = {
    messageId: 0,
    pseudo: 0,
  }
 
  async function evaluate (user, messageId, evaluat, report, action) {
    voteReadParam.pseudo = user.pseudo
    voteReadParam.messageId = messageId

    console.log( voteReadParam )
    const tx = await neo4jRequest.beginTransaction(true)
    let res = await neo4jRequest.runRequest(tx, voteReadReq, voteReadParam)
    if (res.length !== 1) {
      neo4jRequest.closeTransaction(tx)
      return null
    }
    let result = res[0]

    if( result.author.id === result.user.id)
      return null
    if( result.myVote && action === 'evaluat')
      return null
    if( !result.myVote && action !== 'evaluat') 
      return null
   
    if( report && !evaluat) 
      evaluat = 1
    if( action !== 'evaluat' ) {
      add( -1, result.message, result.author, result.myVote.vote, result.myVote.report)
    }
    if( action !=='delete' ) {
      add( +1, result.message, result.author, evaluat, report)
    }
    newStat( result.message, result.author)

    let req
    if( action === 'delete') {
      delete result.myVote
      req = `
      MATCH (message), 
        (author), 
        (v: Vote {messageId: message.id, userId: $userId})
      WHERE id( message) = $idMessage
        AND id( author) = $idAuthor
      set message = $message,
        author = $author
      WITH v 
      delete v
      RETURN 0 AS null
      `
    } else {
      result.myVote = {
        userId : result.user.id,
        messageId: messageId,
        pseudo: user.pseudo,
        vote: evaluat,
        report: report
      }
      req= `
        MATCH ( message), ( author)
        WHERE id( message)= $idMessage
          AND id( author)= $idAuthor
        merge(myVote: Vote {messageId: $myVote.messageId, userId: $myVote.userId}) 
        set message = $message,
          author = $author,
          myVote = $myVote 
        RETURN 0 AS null
      `
    }

    res = await neo4jRequest.runRequest(tx, req, result )
    if (res.length !== 1) {
      neo4jRequest.rollBackTransaction(tx)
      return null
    }
    neo4jRequest.closeTransaction(tx)

    result.message.author = result.author
    result.message.myVote = action === 'delete'? null: result.myVote
    return result.message
  }

  refDBNodes.Vote = {evaluate }
}
