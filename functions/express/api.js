'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();

/*
// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};
*/

app.use(cors);
app.use(cookieParser);
// app.use(validateFirebaseIdToken);

// https://...cloudfunctions.net/api/expressTime
app.get('/expressTime', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ timestamp: Date.now(), humanReadable: (new Date()).toString() }));
});

app.get('/rtdbCounter', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  admin.database().ref('counter/value').once('value', snapshot => {
    res.send(JSON.stringify({ value: snapshot.val() || 0 }));
  })
});

app.get('/firestoreCounter', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  admin.firestore().collection('counters').where('id', '==', 'main').get().then(snapshot => {
    if (snapshot.size !== 1) {
      res.send(JSON.stringify({ value: 0, error: true }));
    } else {
      snapshot.forEach(document => {
        res.send(JSON.stringify({ value: document.data().value || 0 }));
      });
    }
  })
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports = module.exports = functions.https.onRequest(app);