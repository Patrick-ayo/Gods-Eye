// Firebase Admin SDK initialization for backend
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json'); // You need to provide this file from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gods-eye-login-6969.firebaseio.com'
});

module.exports = admin; 