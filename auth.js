const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'pennies-9cba3',
    clientEmail: 'firebase-adminsdk-px431@pennies-9cba3.iam.gserviceaccount.com',
    privateKey: ''
  }),
  databaseURL: 'https://pennies-9cba3.firebaseio.com/'
})

module.exports = token => {
  return new Promise((resolve, reject) => {
    admin.auth().verifyIdToken(token)
      .then(resolve)
      .catch(reject)
  })
}
