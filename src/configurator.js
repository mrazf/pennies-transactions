const AWS = require('aws-sdk')

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
  logger: console
})

const monzoClientId = process.env.MONZO_CLIENT_ID
const monzoClientSecret = process.env.MONZO_CLIENT_SECRET

module.exports = ({ uid }) => {
  const params = { TableName: 'Pennies-MonzoApiToken', Key: { 'pennies_user_id': uid } }

  return new Promise((resolve, reject) => {
    dynamo.get(params, (err, data) => {
      if (err) reject(err)

      resolve({
        uid,
        dynamo,
        monzo: {
          clientId: monzoClientId,
          clientSecret: monzoClientSecret,
          accountId: data['Item'].account_id,
          token: data['Item']
        }
      })
    })
  })
}
