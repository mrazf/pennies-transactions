const get = require('./get')
const refresh = require('./refresh')

module.exports = ({ uid, monzo, dynamo }, from, to) => {
  return new Promise((resolve, reject) => {
    get(monzo, from, to)
      .then(resolve)
      .catch(err => {
        console.warn(`Get transactions failed with ${err}, refreshing and retrying`)

        refresh({ uid, monzo, dynamo })
          .then(({ monzo }) => get(monzo, from, to))
          .then(resolve)
          .catch(reject)
      })
  })
}
