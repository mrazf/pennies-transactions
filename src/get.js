const request = require('request')
const moment = require('moment')
const save = require('./configurator').save

const refresh = ({ uid, monzoToken }) => {
  return new Promise((resolve, reject) => {
    const options = {
      url: 'https://api.monzo.com/oauth2/token',
      form: {
        grant_type: 'refresh_token',
        client_id: monzoToken.client_id,
        client_secret: monzoToken.client_secret,
        refresh_token: monzoToken.refresh_token
      }
    }

    request.post(options, (err, resCode, body) => {
      if (err || body.error) reject(err)

      const accessToken = JSON.parse(body)

      resolve({ uid, monzoToken: accessToken })
    })
  })
}

const refreshAndSave = config => refresh(config).then(save)

const get = ({ monzoToken }, from, to) => {
  const since = from || moment.utc().subtract(2, 'month').endOf('month').format()
  const before = to || moment.utc().endOf('month').format()
  const url = `https://api.monzo.com/transactions?account_id=${monzoToken.account_id}&expand[]=merchant&since=${since}&before=${before}`
  const headers = { Authorization: `Bearer ${monzoToken.access_token}` }

  return new Promise((resolve, reject) => {
    console.info(`GET ${url}`)
    request.get(url, { headers }, (err, res, body) => {
      if (err) {
        console.error(`GET ${url} errored with ${err} at ${err.stack}`)

        reject(err)
      }

      const response = JSON.parse(body)

      if (response.error) return reject(response)

      const transactions = response.transactions || []

      if (!transactions.length) {
        console.info('GET https://api.monzo.com/transactions got no transactions')
        resolve({ transactions })
      }

      console.info(`GET https://api.monzo.com/transactions got ${transactions.length} transactions`)

      resolve({ transactions })
    })
  })
}

module.exports = (config, from, to) => {
  return new Promise((resolve, reject) => {
    get(config, from, to)
    .then(resolve)
    .catch(err => {
      if (err.code === 'unauthorized.bad_access_token') {
        console.info('Token expired, refreshing and retrying')

        refreshAndSave(config, from, to)
          .then(get)
          .catch(reject)
      } else {
        reject(err)
      }
    })
  })
}
