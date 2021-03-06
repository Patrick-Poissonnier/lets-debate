import Vue from 'vue'
import Vuex from 'vuex'
import debate from './debate'
import libMessage from '@/lib/libMessage'

import axios from "@/lib/myAxios"

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const home = {
  component : null,
  props: {},
}
Object.freeze( home)

const nullUser = {
  user: {
    pseudo: '',
    auth: 0,
  },
  userAccess: '',
}
Object.freeze( nullUser)

export default new Vuex.Store({
   modules: {
    debate: debate,
  }, 
  state: {
    mainPage : { 
      component : '',
      props:{},
    },
    connectedUser: nullUser,
  },

  actions: {
    async initStore( { dispatch, commit, state }, url) {
      await libMessage.init( window.indexedDB)
      const userAccess = sessionStorage.getItem("userData")
        || localStorage.getItem("userData")

      if( userAccess) {
        commit('_setUserAccess', userAccess)     //for myAxios.interceptors.request
        const response = await axios.post("user/resumeConnection/", {})
        if( typeof response.data === "object") {
          dispatch('login', response.data)
        } else {
          dispatch('logout')
        }
      } else {
        dispatch('logout')
      }

      let component = url.pathname.substring(1)
      let props = null
      if( component) {
          props = JSON.parse( decodeURI( url.search.substring(1))) 
      } else {
        component = 'Debate'
        props = {id: state.connectedUser.pseudo ? 2: 1}
      }
      commit('setMainPage', {component, props})      
    },


    login( {dispatch}, data) {
      if( data.userAccess) {
        dispatch( '_setConnectedUser', data)

        sessionStorage.setItem("userData", data.userAccess);
        if( data.persist) {
          localStorage.setItem("userData", data.userAccess);
        } else {
          localStorage.removeItem("userData");
        }
      } else {
        dispatch('logout')
      }
    },

    register( {commit, dispatch}, data){
      if( data.userAccess) {
        dispatch('_setConnectedUser' ,data)

        sessionStorage.setItem("userData", data.userAccess);
        if( data.persist) {
          localStorage.setItem( 'userData', data.userAccess);
        } else {
          localStorage.removeItem( 'userData')
        }
        commit('setMainPage', { component:'UserInfo', props: {pseudo: data.user.pseudo}})
      } else {
        dispatch('logout')
      }
    },

    logout( {commit}) {
      localStorage.removeItem( 'userData')
      sessionStorage.removeItem( 'userData')
      libMessage.setReader( '')
      commit('_logout')
    },

    _setConnectedUser( {commit}, data) {
      libMessage.setReader( data.user.pseudo)
      commit('_setConnectedUser', data)
    }
  },

  getters: {
    getMainPage (state) {
      return state.mainPage
    },
    getconnectedUser (state) {
      return state.connectedUser.user
    },
    getUserAccess( state) {
      return state.connectedUser.userAccess
    },
  },

  mutations: {
    setMainPage( state, mainPage) {
//      console.log( "setMainPage")
      window.history.pushState(mainPage, "", `${mainPage.component}?${JSON.stringify(mainPage.props)}`)
      state.mainPage = Object.assign( {}, mainPage)
    },

    historyBack: ( state, eventState ) => {
//      console.log( "historyBack")
      if( !eventState) {
        window.history.back()
      } else {
        state.mainPage = eventState
      }
    },

    updateUser( state, user) {
      state.connectedUser.user =user
    },
    _setConnectedUser( state, data) {
      state.connectedUser = Object.assign( {}, data)
//      state.mainPage = Object.assign( {}, state.mainPage)
    },
    _setUserAccess( state, userAccess) {
      state.connectedUser = Object.assign( {}, nullUser, {userAccess})
    },
    _logout( state) {
      state.connectedUser = nullUser
//      state.mainPage = Object.assign( {}, state.mainPage)
    }

  },

//  modules: {
//  },
  strict: debug
//  plugins: debug ? [createLogger()] : []
})
