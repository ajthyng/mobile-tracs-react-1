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

/**
 * The following sections are still being called.
 * All the logic is in place to make it work but it's not necessary to cache at this time.
 */
exports.sites = {
  async getSites (netid) {
    return Promise.resolve({})
  },
  async store (sites, netid) {
    return Promise.resolve(true)
  },
  async clean (siteIDs) {
    return Promise.resolve(true)
  }
}

exports.notifications = {
  async getNotifications () {
    return Promise.resolve({})
  },
  async store (notifications) {
    return Promise.resolve(true)
  },
  async update (ids, status) {
    return Promise.resolve(true)
  },
  async reset () {
    return Promise.resolve(true)
  },
  async delete (id) {
    return Promise.resolve(true)
  }
}

exports.clear = async () => {
  return Promise.resolve(true)
}

exports.token = {
  async getDeviceToken () {
    if (global.android) {
      return FCM.getFCMToken().then(token => Promise.resolve(token))
    } else {
      return new Promise((resolve, reject) => {
        if (global.simulator) return resolve('9561548f635aad3fd3361c3dfe4c345d0aa0d3a32542675563eea05a6212dc95')
        PushNotification.configure({
          onRegister: ({token, ios}) => {
            return resolve(token)
          }
        })
      })
    }
  }
}
