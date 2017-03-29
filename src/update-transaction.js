const request = require('request')

module.exports = ({ monzo }, update) => {
  const url = `https://api.monzo.com/transactions/${update.transaction.id}`
  const headers = { Authorization: `Bearer ${monzo.token.access_token}` }
  const form = { metadata: { category: update.categoryUpdate } }

  return new Promise((resolve, reject) => {
    console.info(`PATCH ${url}`)
    request.patch(url, { headers, form }, (err, res, body) => {
      if (err) {
        console.error(`PATCH ${url} errored with ${err} at ${err.stack}`)

        return reject(err)
      }

      const response = JSON.parse(body)
      if (response.error) {
        console.error(response)

        return reject(response.error)
      }

      console.info(`PATCH ${url} success`)

      return resolve({ transaction: response.transaction })
    })
  })
}
