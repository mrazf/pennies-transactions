const auth = require('auth')

module.exports.handler = (event, context, callback) => {
  const token = event.headers.authorization.substring('Bearer: '.length)

  return new Promise((resolve, reject) => {
    auth(token)
      .then(() => {
        const response = {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: {
            headers: event.headers
          }
        }

        callback(null, response)
      })
  })
}
