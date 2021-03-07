import libUser from '@/DAL/libUser'
import libMessage from '@/DAL/libMessage'

const nullUser = {
  user: {
    pseudo: '',
    auth: 0,
  },
  userAccess: '',
}
Object.freeze(nullUser)


const user = {
  state: () => ({
    connectedUser: nullUser,
  }),

  getters: {
    getConnectedUser(state) {
      return state.connectedUser.user
    },
    getUserAccess(state) {
      return state.connectedUser.userAccess
    },
  },

  actions: {
    async login({ commit }, data) {
      const response = await libUser.login(data)
      if (typeof response === 'object') {
        commit('_setConnectedUser', response)
      }
      return response
    },

    async newUser({ commit }, data) {
      const response = await libUser.register(data)
      if (response && response.userAccess) {
        commit('_setConnectedUser', response)
        commit('setMainPage', { component: 'UserInfo', props: { pseudo: response.user.pseudo } })
      }
      return response
    },

    async updateUser({ commit }, data) {
      const response = await libUser.update(data)
      if (typeof response === 'object') {
        commit('_updateUser', response)
      }
      return response
    },
    async newAvatar({ commit }, data) {
      const response = await libUser.newAvatar(data)
      if (typeof response === 'object') {
        commit('_updateUser', response)
      }
      return response
    },

    async logout({ commit }) {
      await libUser.logout()
      commit('_logout')
    },
  },

  mutations: {
    _updateUser(state, user) {
      state.connectedUser.user = user
    },
    _setConnectedUser(state, data) {
      libMessage.setReader(data.user.pseudo)
      sessionStorage.setItem("userData", data.userAccess);
      if (data.persist) {
        localStorage.setItem('userData', data.userAccess);
      } else {
        localStorage.removeItem('userData')
      }
      state.connectedUser = Object.assign({}, data)
    },
    _setUserAccess(state, userAccess) {
      state.connectedUser = Object.assign({}, nullUser, { userAccess })
    },
    _logout(state) {
      localStorage.removeItem('userData')
      sessionStorage.removeItem('userData')
      libMessage.setReader('')
      state.connectedUser = nullUser
    }
  }
}

export default user