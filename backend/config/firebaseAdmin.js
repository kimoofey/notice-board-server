const admin = require('firebase-admin');
let serviceAccount = {};

if (process.env.NODE_ENV === 'production') {
    serviceAccount.type = process.env.TYPE;
    serviceAccount.project_id = process.env.PROJECTID;
    serviceAccount.private_key_id = process.env.PRIVATE_KEY_ID;
    serviceAccount.private_key = process.env.PRIVATE_KEY;
    serviceAccount.client_email = process.env.CLIENT_EMAIL;
    serviceAccount.client_id = process.env.CLIENT_ID;
    serviceAccount.auth_uri = process.env.AUTH_URI;
    serviceAccount.token_uri = process.env.TOKEN_URI;
    serviceAccount.auth_provider_x509_cert_url = process.env.AUTH_PROVIDER_X509_CERT_URL;
    serviceAccount.client_x509_cert_url = process.env.CLIENT_X509_CERT_URL;
} else {
    serviceAccount = require('./adminAccountKey.json');
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://testing-chat-10f25.firebaseio.com',
    storageBucket: 'testing-chat-10f25.appspot.com',
});

module.exports = admin;