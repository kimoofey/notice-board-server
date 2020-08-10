const express = require('express');
const router = express.Router();
const firebase = require('../../config/firebase');
const admin = require('../../config/firebaseAdmin');
const db = require('../../config/firebaseDB');
const messagesCollection = 'Messages';

router.get('/', async (req, res) => {
    try {
        let messages = [];
        const result = await db.collection(messagesCollection).doc(req.query.groupChatId)
            .collection(req.query.groupChatId)
            .onSnapshot((snapshot) => {
                    messages = snapshot.docChanges().map((change) => {
                        if (change.type === 'added') {
                            let data = change.doc.data();
                            return data;
                        }
                    });
                    return res.status(200).json(messages);
                },
            );
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});


module.exports = router;