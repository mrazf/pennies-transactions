const get = require('./get')
const refresh = require('./refresh')

const refreshOrReject = ({ uid, monzo, dynamo }, err) => {
  return new Promise((resolve, reject) => {
    console.log('refreshOrReject', err)

    refresh({ uid, monzo, dynamo })
      .then(get)
      .catch(reject)
  })
}

module.exports = ({ uid, monzo, dynamo }, from, to) => {
  return new Promise((resolve, reject) => {
    get(monzo, from, to)
      .then(resolve)
      .catch(err => refreshOrReject({ uid, monzo, dynamo }, err))
      .catch(reject)
  })
}
