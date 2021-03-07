//import Vue from 'vue'
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
    async login({ dispatch }, data) {
      const response = await libUser.login(data)

      //      console.log(response)
      if (typeof response === 'object') {
        dispatch('_setConnectedUser', response)

        sessionStorage.setItem("userData", response.userAccess);
        if (data.persist) {
          localStorage.setItem("userData", response.userAccess);
        } else {
          localStorage.removeItem("userData");
        }
      } else {
        dispatch('logout')
      }
      return response
    },

    async newUser({ commit, dispatch }, data) {
      const response = await libUser.register(data)
      if (response && response.userAccess) {
        dispatch('_setConnectedUser', response)

        commit('setMainPage', { component: 'UserInfo', props: { pseudo: response.user.pseudo } })
      } else {
        dispatch('logout')
      }
      return response
    },

    async updateUser({ commit }, data) {
      const response = await libUser.update(data)
      if (typeof response === 'object') {
        commit('_setConnectedUser', response)
      }
      return response
    },
    async newAvatar({ commit }, data) {
      const response = await libUser.newAvatar(data)
      console.log(response)
      alert("newAvatar");
      if (typeof response === 'object') {
        //commit('_setConnectedUser', response)
      }
    },

    async logout({ commit }) {
      await libUser.logout()
      commit('logout')
    },

    _setConnectedUser({ commit }, data) {
      libMessage.setReader(data.user.pseudo)
      commit('_setConnectedUser', data)
    }
  },

  mutations: {
    updateUser(state, user) {
      state.connectedUser.user = user
    },
    _setConnectedUser(state, data) {
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
    logout(state) {
      localStorage.removeItem('userData')
      sessionStorage.removeItem('userData')
      libMessage.setReader('')
      state.connectedUser = nullUser
    }
  }
}

export default user