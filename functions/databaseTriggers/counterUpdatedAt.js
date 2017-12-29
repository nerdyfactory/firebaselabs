const functions = require('firebase-functions');

exports = module.exports = functions.database.ref('/counter/value')
  .onWrite(event => event.data.ref.parent.child('updatedAt').set(Date.now()))