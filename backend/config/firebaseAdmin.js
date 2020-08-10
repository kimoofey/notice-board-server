const admin = require('firebase-admin');
let serviceAccount = {};

if (process.env.NODE_ENV === 'production') {
    serviceAccount = process.env.FIREBASEADMINKEY;
} else {
    serviceAccount = require('./adminAccountKey.json');
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://testing-chat-10f25.firebaseio.com',
    storageBucket: 'testing-chat-10f25.appspot.com',
});

module.exports = admin;