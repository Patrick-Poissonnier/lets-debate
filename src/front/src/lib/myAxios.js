import axios from 'axios'
import {config} from '@/config/config'
import store from '@/store'

const myAxios = axios.create({
 baseURL: config.API_URL,
 withCredentials : true,
})


myAxios.interceptors.request.use(
  request => {
    const userAccess = store.getters.getUserAccess
    if( userAccess) {
      request.headers = { 'useraccess' : userAccess}
    }
    return  request
  }, error => {
    console.log(error)
    throw error
})

myAxios.interceptors.response.use(
  response => {
    console.log(response)
    return  response  // status code 2xx
  }, 
  error => {
    if( error.response.status === 403 ) {
    store.dispatch( 'logout')
    return error 
  } else {
    console.log(error.request)
    console.log(error.response)
    if( error.response.status === 500) {
      window.alert(`Erreur Interne : re-éssayez plus tard`);
    }
    return( error)
  }
})

export default myAxios 