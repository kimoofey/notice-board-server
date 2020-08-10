const firebase = require('firebase');
let firebaseConfig = {};

if (process.env.NODE_ENV === 'production') {
    firebaseConfig = process.env.FIREBASEACCOUNTKEY;
} else {
    firebaseConfig = require('./accountKey.json');
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase;