import axios from '@/DAL/myAxios'

const login = function (data) {
  return _backAccess("user/login/", data)
}
const resumeConnection = function () {
  return _backAccess("user/resumeConnection/", {})
}
const logout = function () {
  return _backAccess("user/logout/", {})
}
const register = function (data) {
  return _backAccess("user/register/", data)
}
const update = function (data) {
  return _backAccess("user/update/", data)
}
const newAvatar = function (data) {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
  return _backAccess("/user/newAvatar", data, config)
  //return null
}

const get = function (pseudo) {
  return _backAccess('user/getUser', { pseudo })
}

const _backAccess = function (req, data, config) {
  return new Promise((resolve) => {
    axios.post(req, data, config)
      .then(response => {
        resolve(response && response.data)
      })
      .catch(error => {
        console.log(req + ' : ' + (error.message || error.toString()))
        resolve(null)
      })
  })
}

const libUser = {
  login,
  resumeConnection,
  logout,
  register,
  update,
  newAvatar,
  get,
}
export default libUser
