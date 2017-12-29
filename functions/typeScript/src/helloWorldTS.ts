import * as functions from 'firebase-functions';

exports = module.exports = functions.https.onRequest((request, response) => {
  response.send("TypeScript Hello from Firebase!");
});
