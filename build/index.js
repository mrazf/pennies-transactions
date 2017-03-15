const auth = require('auth');

module.exports.handler = (event, context, callback) => {
  console.log(event);
  return new Promise((resolve, reject) => {
    auth();
  });

  const response = {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: {
      headers: event.headers
    }
  };

  callback(null, response);
};