
import axios from '@/DAL/myAxios'
import indexedDB from '@/DAL/indexedDB'

let pseudo = ''

const nullFunction = async function () { return null }
let idbGetMessage = nullFunction
let idbSetMessage = nullFunction
//let idbGetUser = nullFunction
//let idbSetUser = nullFunction

const init = async function (widb) {
  try {
    await indexedDB.init(widb)
    idbGetMessage = indexedDB.get('Message')
    idbSetMessage = indexedDB.set('Message')
    //    idbGetUser = indexedDB.get( 'User')
    //    idbSetUser = indexedDB.set( 'User')
  } catch (err) {
    console.log('init err = ' + err)
  }
}

const setReader = async function (_pseudo) {
  pseudo = _pseudo
}

const _updateMessage = async function (backMessage) {
  //  console.log( "updateMessage "+ backMessage.id)

  let idbMessage = await idbGetMessage(backMessage.id)
  let content = []
  if (!idbMessage) {
    content = ["TEXT", "MYVOTE"]
    idbMessage = { id: backMessage.id }
  } else {
    content = []
    if (idbMessage.version !== backMessage.version) {
      content.push("TEXT")
    } else {
      backMessage.text = idbMessage.text
    }
    if (pseudo) {
      if (typeof idbMessage[pseudo] === 'undefined') {
        content.push("MYVOTE")
      } else {
        backMessage.myVote = idbMessage[pseudo]
      }
    } else {
      backMessage.myVote = null
    }
  }

  if (content.length) {
    try {
      const response = await axios.post("messages/getSubObj", { content, id: backMessage.id })
      if (response.data && response.data.message) {
        const newMessage = response.data.message

        if (newMessage.text) {
          idbMessage.version = backMessage.version = newMessage.version
          idbMessage.text = backMessage.text = newMessage.text
        }
        if (typeof newMessage.myVote !== 'undefined') {
          idbMessage[pseudo] = backMessage.myVote = newMessage.myVote
        }
        idbSetMessage(idbMessage)
      } else {
        console.log("updateMessage error :" + response.data)
      }
    } catch (err) {
      console.log("updateMessage axios error : " + err)
    }
  }
  return backMessage
}

const getMessage = async function (messageId) {     // should be call by store/debate/loadDebate.js once
  //  console.log( "getMessage " +messageId)
  try {
    const response = await axios.post("messages/getMessage", { id: messageId })
    if (response.data && response.data.message) {
      const backMessage = response.data.message
      return _updateMessage(backMessage)
    } else {
      console.log("getMessage error : " + response.data)
      return null
    }
  } catch (err) {
    console.log("getMessage axios error : " + err)
    return null
  }
}

const createMessage = async function (parentId, message) {
  //  console.log( "createMessage ")
  //  console.log( message)
  try {
    message.parentId = parentId
    const response = await axios.post("messages/writeMessage",
      { message })
    if (response.data && typeof response.data === 'object') {
      const newMessage = response.data
      const idbMessage = {
        id: newMessage.id,
        text: newMessage.text,
        version: newMessage.version,
      }
      idbMessage[pseudo] = newMessage.myVote
      idbSetMessage(idbMessage)
      return newMessage
    } else {
      console.log("createMessage error :" + response.data)
      return null
    }
  } catch (err) {
    console.log(`createMessage error :\n${err}`)
    return null
  }
}

const updateMessage = async function (oldMessage, newMessage) {
  //  console.log( "updateMessage")
  //  console.log( newMessage)
  try {
    newMessage.id = oldMessage.id
    newMessage.parentId = oldMessage.parentId
    const prAxios = axios.post("messages/updateMessage", { message: newMessage })
    const prIdb = idbGetMessage(oldMessage.id)
    const results = await Promise.all([prAxios, prIdb])

    const backResponse = results[0]
    const idbMessage = results[1]
    if (backResponse.data && typeof backResponse.data === 'object') {
      if (newMessage.text) {
        backResponse.data.text = Object.assign({}, oldMessage.text, newMessage.text)

        const newIdbMessage = {
          id: oldMessage.id,
          text: backResponse.data.text,
          version: backResponse.data.version,
        }
        Object.assign(idbMessage, newIdbMessage)
        idbSetMessage(idbMessage)
      }
      return Object.assign({}, oldMessage, backResponse.data)
    } else {
      console.log("updateMessage error :" + backResponse)
      return null
    }

  } catch (err) {
    console.log(`updateMessage error :\n${err}`)
    return null
  }
}

const updateVote = async function (data) {
  //  console.log( 'updateVote', data.messageId)
  try {
    const prAxios = axios.post(`vote/evaluat/`, { data })
    const prIdb = idbGetMessage(data.messageId)
    const results = await Promise.all([prAxios, prIdb])
    const backMessage = results[0].data
    const idbMessage = results[1]

    if ((backMessage !== null) && (typeof backMessage === "object")) {
      if (idbMessage) {
        idbMessage[pseudo] = backMessage.myVote
        idbSetMessage(idbMessage)
      }
      return backMessage
    } else {
      console.log(`updateVote error :\n${backMessage}`)
      return null
    }
  }
  catch (err) {
    console.log(`updateVote axios error :\n${err}`);
    return null
  }
}

//TODO : factirize requests
const getChildsList = async function (parentId, start, index, fnStore) {
  //  console.log( "getChildList " +parentId)
  const data = { parentId, start, index }
  try {
    const response = await axios.post("messages/getChildList/", data)
    if (response.data.list.length) {
      response.data.list.map(async (message, index) => {
        if (message) {
          const updatedMessage = await _updateMessage(message)
          fnStore(index, updatedMessage)
        } else {
          fnStore(index, null)
        }
      })
    } else {
      console.log(`getChildList error: ${response.data}`)
    }
  } catch (err) {
    console.log("getChildsList axios error : " + err)
    return null
  }
}


const getAncestors = async function (message, fnStore) {
  //  console.log('getAncestors '+ message.id)
  let current = message
  let newMessage
  while (current.parentId) {
    newMessage = await getMessage(current.parentId)
    if (!newMessage) {
      break
    }
    fnStore(newMessage)
    current = newMessage
  }
}

/*   const _getAuthor = async function (pseudo) {
    idbGetUser(pseudo)
      .then(async (user) => {
        if (!user) {
          try {
            const response = await axios.post('user/getUser', { pseudo })
            if (typeof response.data !== "string") {
              idbSetUser(response.data)
              resolve(response.data)
            } else {
              console.log(response.data)
              reject(null)
            }
          } catch (err) {
            console.log("getAuthor axios error : " + err)
            reject(null)
          }
        } else {
          resolve(user)
        }
      })
  } */


const libMessage = {
  init,
  setReader,
  getChildsList,
  getMessage,
  createMessage,
  updateMessage,
  updateVote,
  getAncestors,
}

export default libMessage