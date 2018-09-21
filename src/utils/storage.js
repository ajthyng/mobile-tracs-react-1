import * as Keychain from 'react-native-keychain'
import FCM from 'react-native-fcm'
import PushNotification from 'react-native-push-notification'

exports.credentials = {
  get () {
    return Keychain.getGenericPassword().then(creds => {
      return new Promise(resolve => {
        if (!!creds.username === false) {
          return resolve(false)
        } else {
          return resolve({
            username: creds.username,
            password: creds.password
          })
        }
      })
    })
  },
  store (netid, password) {
    return Keychain.setGenericPassword(netid, password)
  },
  async reset () {
    let result = await Keychain.resetGenericPassword()
      .then(result => result)
      .catch(err => console.log(err))
    return Promise.resolve(result)
  }
}

exports.token = {
  async getDeviceToken () {
    if (global.android) {
      return FCM.getFCMToken().then(token => Promise.resolve(token))
    } else {
      return new Promise((resolve, reject) => {
        if (global.simulator) return resolve('9561548f635aad3fd3361c3dfe4c345d0aa0d3a32542675563eea05a6212dc95')
        PushNotification.configure({
          onRegister: ({ token, ios }) => {
            return resolve(token)
          }
        })
      })
    }
  }
}
