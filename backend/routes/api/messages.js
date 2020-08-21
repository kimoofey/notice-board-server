const express = require('express');
const router = express.Router();
const admin = require('../../config/firebaseAdmin');
const db = require('../../config/firebaseDB');
const messagesCollection = 'Messages';

router.get('/', async (req, res) => {
    try {
        const result = await db.collection(messagesCollection).doc(req.query.groupChatId)
            .collection(req.query.groupChatId)
            .onSnapshot((snapshot) => {
                // messages = snapshot.docChanges().map((change) => {
                //     if (change.type === 'added') {
                //         let data = change.doc.data();
                //         return data;
                //     }
                // });
                const messages = snapshot.docChanges().filter((change) => change.type === 'added').map((change) => change.doc.data());
                    return res.status(200).json(messages);
                },
            );
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const itemMessage = {
            _id: req.body._id,
            text: req.body.text,
            createdAt: req.body.createdAt,
            idFrom: req.body.currentUserId,
            idTo: req.body.id,
            user: JSON.parse(req.body.user),
        };
        const result = await admin.firestore()
            .collection('Messages')
            .doc(req.body.groupChatId)
            .collection(req.body.groupChatId)
            .doc(req.body.timestamp)
            .set(itemMessage);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).send(error);
    }
});


module.exports = router;