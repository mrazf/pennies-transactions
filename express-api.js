require('dotenv').config()
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const app = express()

const configurator = require('./configurator').get
const get = require('./get')

const secrets = require('/Users/rfa11/Google Drive/Projects/pennies-9cba3-firebase-adminsdk-px431-bf3d867223.json')

admin.initializeApp({
  credential: admin.credential.cert(secrets),
  databaseURL: 'https://pennies-9cba3.firebaseio.com/'
})

app.use(cors())

app.get('/transactions', function (req, res) {
  const token = req.headers.authorization.substring('Bearer: '.length)

  console.log(req.query)

  admin.auth().verifyIdToken(token)
    .then(configurator)
    .then(config => get(config, req.query.from, req.query.to))
    .then(result => {
      res.send(result)
    })
    .catch((error) => {
      console.log('Top level error: ', error)
    })
})

app.listen(9001, function () {
  console.log('Example app listening on port 3000!')
})
