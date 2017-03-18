require('dotenv').config()
const AWS = require('aws-sdk')

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY
})

const monzoToken = require('/Users/rfa11/Google Drive/Projects/monzo-token.json')

const params = {
  TableName: 'Pennies-MonzoApiToken',
  Item: Object.assign({}, monzoToken, { pennies_user_id: '8AuCqwsxO8dm3KZSGaE5IjWfTAv2' })
}

new Promise((resolve, reject) => {
  dynamo.put(params, (err, data) => {
    if (err) return reject(err)
    console.log(monzoToken)
    resolve()
  })
})
