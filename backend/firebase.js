const admin = require('firebase-admin');

var serviceAccount = undefined;

if (process.env.NODE_ENV !== 'test') {
  if (!admin.apps.length) {
    serviceAccount = require('./firebase-adminsdk.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
}

module.exports = admin;
