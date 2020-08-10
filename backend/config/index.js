exports.PORT = process.env.PORT || 3001;

exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_ORIGIN
    : 'http://localhost:3000';

exports.SECRET_KEY = process.env.NODE_ENV === 'production'
    ? process.env.JWTSECRETKEY
    : require('./jwtSecretKey.json').jwtSecretKey;

