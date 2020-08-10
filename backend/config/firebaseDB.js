const admin = require('./firebaseAdmin');
const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});

module.exports = db;