import Vue from 'vue'
import Vuex from 'vuex'
import debate from './debate'
import user from './user'
import libMessage from '@/DAL/libMessage'
import libUser from '@/DAL/libUser'
//import axios from "@/DAL/myAxios"

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const home = {
  component: null,
  props: {},
}
Object.freeze(home)



export default new Vuex.Store({
  modules: {
    debate: debate,
    user: user,
  },
  state: {
    mainPage: {
      component: '',
      props: {},
    },
  },

  actions: {
    async initStore({ dispatch, commit, getters }, url) {
      await libMessage.init(window.indexedDB)
      const userAccess = sessionStorage.getItem("userData")
        || localStorage.getItem("userData")

      if (userAccess) {
        commit('_setUserAccess', userAccess)     //for myAxios.interceptors.request
        console.log(getters.getConnectedUser)
        const response = await libUser.resumeConnection()
        console.log(response)
        if (typeof response === "object") {
          dispatch('_setConnectedUser', response)
        } else {
          console.log('logout')
          dispatch('logout')
        }
      } else {
        console.log('logout')
        dispatch('logout')
      }

      let component = url.pathname.substring(1)
      let props = null
      if (component) {
        props = JSON.parse(decodeURI(url.search.substring(1)))
      } else {
        component = 'Debate'
        props = { id: getters.getConnectedUser.pseudo ? 2 : 1 }
      }
      commit('setMainPage', { component, props })
    },
  },

  getters: {
    getMainPage(state) {
      return state.mainPage
    },
  },

  mutations: {
    setMainPage(state, mainPage) {
      //      console.log( "setMainPage")
      window.history.pushState(mainPage, "", `${mainPage.component}?${JSON.stringify(mainPage.props)}`)
      state.mainPage = Object.assign({}, mainPage)
    },

    historyBack: (state, eventState) => {
      //      console.log( "historyBack")
      if (!eventState) {
        window.history.back()
      } else {
        state.mainPage = eventState
      }
    },
  },

  strict: debug
  //  plugins: debug ? [createLogger()] : []
})
