const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', {title: 'Express'});
});

router.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + "../public/images/favicon.ico");
});

module.exports = router;
