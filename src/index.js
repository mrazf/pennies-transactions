require('dotenv').config()
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const configurator = require('./configurator').get
const get = require('./get')

const app = express()

app.set('port', (process.env.PORT || 9001))
app.use(cors())

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }),
  databaseURL: 'https://pennies-9cba3.firebaseio.com/'
})

app.get('/status', (req, res) => {
  res.send('Looks like we\'re OK')
})

app.get('/transactions', function (req, res) {
  const token = req.headers.authorization.substring('Bearer: '.length)

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

app.listen(app.get('port'), function () {
  console.log('Pennies Transactions is running on port', app.get('port'))
})
