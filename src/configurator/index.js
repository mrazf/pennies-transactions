const AWS = require('aws-sdk')

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY
})

const get = ({ uid }) => {
  const params = { TableName: 'Pennies-MonzoApiToken', Key: { 'pennies_user_id': uid } }

  return new Promise(function (resolve, reject) {
    dynamo.get(params, function (err, data) {
      if (err) reject(err)

      resolve({
        uid,
        monzoToken: data['Item']
      })
    })
  })
}

const save = ({ uid, monzoToken }) => {
  const params = {
    TableName: 'Pennies-MonzoApiToken',
    Item: {
      ...monzoToken,
      pennies_user_id: uid
    }
  }

  return new Promise((resolve, reject) => {
    dynamo.put(params, (err, data) => {
      if (err) return reject(err)
      console.log(monzoToken)
      resolve({ uid, monzoToken })
    })
  })
}

module.exports = {
  get,
  save
}
