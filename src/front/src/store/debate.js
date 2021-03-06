import Vue from 'vue'
import libMessage from '@/lib/libMessage'

const nullChilds = function () {
  return {
    sortIndex: 1,
    list: [],   // message
    fullList: false,
    scrollPos: 0,
  }
}
const copyChilds = function (childs) {
  return {
    sortIndex: childs.sortIndex,
    list: Object.assign([], childs.list),
    fullList: childs.fullList,
    scrollPos: childs.scrollPos,
  }
}

const debate = {
  state: () => ({
    ancestors: [],  // index: {message, childs (without vue reactivity)}
    index: 0,    // current index in ancestors array
    message: null,
    childs: nullChilds(),
    readerPseudo: '',
    authors: {
      // pseudo: {
      // user   (same Object share between AuthorAvatar.Vue)
      // nbAccess (nb mounted AuthorAvatar.Vue ; without vue reactivity)
      //}
    },
  }),

  //////////////////////////////////////////////////////////////
  getters: {
    getMainMesssage: (state) => {
      return state.message
    },
    getAncestors: (state) => {
      return state.ancestors.slice(0, state.index)
    },
    getChilds: (state) => {
      return state.childs
    },
    getSortIndex: (state) => {
      return state.childs.sortIndex
    },
    getReader(state) {
      return state.readerPseudo
    },
    getScrollPos(state) {
      return state.childs.scrollPos
    },
    getAuthor: state => (pseudo) => {
      return state.authors[pseudo]
    },
  },
  /////////////////////////////////////////////////////////////////
  actions: {
    loadDebate({ dispatch, commit, state, rootGetters }, id) {
      //      console.log( 'loadDebate '+ id)
      if (state.readerPseudo !== rootGetters.getconnectedUser.pseudo
        || !state.message
        || state.message.id !== id) {
        //        console.log( 'loadDebate : update '+ id)
        libMessage.getMessage(id)
          .then(message => {
            commit('_initDebate', { message, pseudo: rootGetters.getconnectedUser.pseudo })
            dispatch('_loadChilds')
            dispatch('_loadAncestors')
          })
          .catch(response => {
            console.log('loadDebate err' + response)
          })
      }
    },

    goChild({ dispatch, commit, state }, childsIndex) {
      commit('_goChild', childsIndex)
      commit('setMainPage', {
        component: 'Debate',
        props: { id: state.message.id }
      })
      dispatch('_loadChilds')
    },

    setChildsSort({ dispatch, commit }, sortIndex) {
      commit('_setChildsSort', sortIndex)
      dispatch('_loadChilds')
    },

    goAncestor({ dispatch, commit, state }, index) {
      commit('_goAncestor', index)
      commit('setMainPage', {
        component: 'Debate',
        props: { id: state.message.id }
      })
      dispatch('_loadChilds')
    },

    newVote({ commit }, message) {
      //      console.log( message)
      commit('_newVote', message)
      commit('_updateAuthor', message.author)
    },

    setAuthor({ commit, state }, pseudo) {   // all messages share same Author object
      //      console.log( 'setAuthor ' +pseudo)
      const elt = state.authors[pseudo]
      if (typeof elt !== "object") {
        commit('_newAuthor', pseudo)
        libMessage.getAuthor(pseudo)
          .then(author => {
            commit('_updateAuthor', author)
          })
      } else {
        elt.nbAccess++
      }
    },

    _loadChilds({ state, commit }) {
      if (!state.childs.fullList) {
        const start = state.childs.list.length
        libMessage.getChildsList(
          state.message.id,
          start,
          state.childs.sortIndex,
          (pos, message) => {
            commit('_enrChild', { pos: start + pos, message })
          }
        )
      }
    },

    _loadAncestors: ({ state, commit }) => {
      libMessage.getAncestors(state.message,
        (message) => {
          commit('_setAncestor', message)
        })
    },

  },

  mutations: {
    newMessage(state, newMessage) {
      state.childs.list.unshift(newMessage)
      state.message.nbResponse++
    },

    updateMessage(state, { message, index }) {
      if (typeof index === 'number') {
        Object.assign(state.childs.list[index], message)
      } else {
        Object.assign(state.message, message)
      }
    },


    _newVote(state, message) {
      if (message.id !== state.message.id) {
        console.log("bug : " + message.id + '<>' + state.message.id)
        return
      }
      Object.assign(state.message, message)
      //      state.authors[ message.author.pseudo].user = message.author
    },

    _newAuthor(state, pseudo) {
      const tmp = Vue.set(state.authors, pseudo, {})
      tmp.nbAccess = 1
    },

    _updateAuthor(state, user) {
      const nbAccess = state.authors[user.pseudo].nbAccess
      const tmp = Vue.set(state.authors, user.pseudo, user)
      tmp.nbAccess = nbAccess
    },

    releaseAuthor(state, pseudo) {
      const elt = state.authors[pseudo]
      if (!elt) {
        console.log('bug !')
      } else {
        if (!(--elt.nbAccess)) {
          delete state.authors[pseudo]
        }
      }
    },

    _goAncestor(state, index) {
      if (index === -1) {
        index = state.index - 1
      }
      let current
      if (state.ancestors.length === state.index) {
        state.ancestors.push(
          { message: Object.assign({}, state.message) })
        current = state.ancestors[state.index]
      } else {
        current = state.ancestors[index + 1]
      }
      const childs = state.childs
      childs.scrollPos = document.querySelector('.debate').scrollTop
      current.childs = copyChilds(childs)

      state.index = index
      const ancestor = state.ancestors[state.index]
      state.message = ancestor.message
      state.childs = copyChilds(ancestor.childs)
    },

    _initDebate(state, { message, pseudo }) {
      state.message = message
      state.childs = nullChilds()
      state.ancestors = []
      state.readerPseudo = pseudo
      state.index = 0
    },

    _goChild(state, childsIndex) {
      //      console.log( '_goChild '+ childsIndex)
      let newMain = state.childs.list[childsIndex]

      if (state.ancestors.length > state.index) {
        if (state.ancestors[state.index + 1].message.id
          === newMain.id) {
          state.ancestors[state.index].childs.scrollPos =
            document.querySelector('.debate').scrollTop
          state.index++
          state.message = state.ancestors[state.index].message
          state.childs = copyChilds(state.ancestors[state.index].childs)
          return
        } else {
          state.ancestors = state.ancestors.slice(0, state.index)
        }
      }

      const last = state.ancestors.push({ message: state.message })
      const childs = state.childs
      childs.scrollPos = document.querySelector('.debate').scrollTop
      state.ancestors[last - 1].childs = copyChilds(childs)
      state.index++

      state.message = newMain
      state.childs = nullChilds()
    },

    _setChildsSort(state, sortIndex) {
      if (state.childs.sortIndex !== sortIndex) {
        state.childs = nullChilds()
        state.childs.sortIndex = sortIndex
      }
    },

    _enrChild(state, { pos, message }) {
      if (message) {
        Vue.set(state.childs.list, pos, message)
      } else {
        state.childs.fullList = true
      }
    },

    _setAncestor(state, message) {
      state.ancestors.unshift({ message: message })
      state.ancestors[0].childs = nullChilds()
      state.index++
    },
  },
}

export default debate