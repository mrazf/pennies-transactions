const get = require('./get')
const refresh = require('./refresh')

module.exports = ({ uid, monzo, dynamo }, from, to) => {
  return new Promise((resolve, reject) => {
    get(monzo, from, to)
      .then(resolve)
      .catch(console.log)
      .then(() => refresh({ uid, monzo, dynamo }))
      .then(({ monzo }) => get(monzo, from, to))
      .then(resolve)
      .catch(reject)
  })
}
