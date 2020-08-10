const firebase = require('firebase');
let firebaseConfig = {};

if (process.env.NODE_ENV === 'production') {
    firebaseConfig.apiKey = process.env.APIKEY;
    firebaseConfig.authDomain = process.env.AUTHDOMAIN;
    firebaseConfig.databaseURL = process.env.DATABASEURL;
    firebaseConfig.projectId = process.env.PROJECTID;
    firebaseConfig.storageBucket = process.env.STORAGEBUCKET;
    firebaseConfig.messagingSenderId = process.env.MESSAGINGSENDERID;
    firebaseConfig.appId = process.env.APPID;
} else {
    firebaseConfig = require('./accountKey.json');
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = firebase;