require('dotenv').config()
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const configurator = require('./configurator')
const getTransactions = require('./get-transactions')
const updateTransaction = require('./update-transaction')

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

app.get('/transactions', (req, res) => {
  const token = req.headers.authorization.substring('Bearer: '.length)

  admin.auth().verifyIdToken(token)
    .then(configurator)
    .then(config => getTransactions(config, req.query.from, req.query.to))
    .then(result => res.send(result))
    .catch(err => res.send({ code: 503, err }))
})

app.post('/transactions/:id', (req, res) => {
  const token = req.headers.authorization.substring('Bearer: '.length)

  admin.auth().verifyIdToken(token)
    .then(configurator)
    .then(config => updateTransaction(config, req.params.id))
    .then(result => res.send(result))
})

app.get('/status', (req, res) => { res.send('Looks like we\'re OK') })

app.listen(app.get('port'), () => console.log('Pennies Transactions is running on port', app.get('port')))
