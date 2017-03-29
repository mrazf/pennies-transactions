require('dotenv').config()
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const configurator = require('./configurator')
const getTransactions = require('./get-transactions')
const updateTransaction = require('./update-transaction')

const app = express()

app.set('port', (process.env.PORT || 9001))
app.use(bodyParser.json())
app.use(cors())

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }),
  databaseURL: 'https://pennies-9cba3.firebaseio.com/'
})

const authenticate = (req, res, next) => {
  const token = req.headers.authorization.substring('Bearer: '.length)

  admin.auth().verifyIdToken(token)
    .then(({ uid }) => {
      req.params.uid = uid
      next()
    })
    .catch(err => res.send({ code: 401, err }))
}

app.get('/transactions', authenticate, (req, res) => {
  configurator(req.params.uid)
    .then(config => getTransactions(config, req.query.from, req.query.to))
    .then(result => res.send(result))
    .catch(err => {
      res.send({ code: 503, err })
    })
})

app.post('/transactions/:id', authenticate, (req, res) => {
  console.log(req)
  configurator(req.params.uid)
    .then(config => updateTransaction(config, req.body))
    .then(result => res.send(result))
    .catch(err => {
      res.send({ code: 503, err })
    })
})

app.get('/status', (req, res) => { res.send('Looks like we\'re OK') })

app.listen(app.get('port'), () => console.log('Pennies Transactions is running on port', app.get('port')))
