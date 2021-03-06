const moment = require('moment')
const request = require('request')

module.exports = (monzo, from, to) => {
  const since = from || moment.utc().subtract(2, 'month').endOf('month').format()
  const before = to || moment.utc().endOf('month').format()
  const url = `https://api.monzo.com/transactions?account_id=${monzo.accountId}&expand[]=merchant&since=${since}&before=${before}`
  const headers = { Authorization: `Bearer ${monzo.token.access_token}` }

  return new Promise((resolve, reject) => {
    console.info(`GET ${url}`)
    request.get(url, { headers }, (err, res, body) => {
      if (err) {
        console.error(`GET ${url} errored with ${err} at ${err.stack}`)

        return reject(err)
      }

      const response = JSON.parse(body)
      if (response.error) {
        console.error(response)

        return reject(response.error)
      }

      const transactions = response.transactions || []

      if (!transactions.length) {
        console.info('GET https://api.monzo.com/transactions got no transactions')
        return resolve({ transactions })
      }

      console.info(`GET https://api.monzo.com/transactions got ${transactions.length} transactions`)

      return resolve({ transactions })
    })
  })
}
