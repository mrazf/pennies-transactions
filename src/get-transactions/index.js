const get = require('./get')
const refresh = require('./refresh')

const refreshOrReject = (err) => {
  return new Promise((resolve, reject) => {
    if (err.code !== 'unauthorized.bad_access_token') return reject(err)

    refresh()
      .then(get)
      .catch(reject)
  })
}

module.exports = ({ uid, monzo, dynamo }, from, to) => {
  return new Promise((resolve, reject) => {
    get(monzo, from, to)
      .then(resolve)
      .catch(err => refreshOrReject(err))
      .catch(reject)
  })
}
