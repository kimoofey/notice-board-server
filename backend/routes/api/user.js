const express = require('express');
const {v4: uuidv4} = require('uuid');
const validator = require("email-validator");
const fs = require('fs');
const router = express.Router();
const firebase = require('../../config/firebase');
const admin = require('../../config/firebaseAdmin');
const db = require('../../config/firebaseDB');
const userCollection = 'users';

/* Get all users */
router.get('/', async (req, res) => {
    try {
        const userQuerySnapshot = await db.collection(userCollection).get();
        const users = [];
        userQuerySnapshot.forEach((doc) => {
            users.push({...doc.data(), docId: doc.id});
        });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/* Create user */
router.post('/', async (req, res) => {
    try {
        const {body: {email, password, nickname, passCode, safeCode}} = req;
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });
        const docRef = db.collection(userCollection).doc();
        await docRef.set({
            name: nickname,
            id: userRecord.uid,
            email,
            password,
            URL: '',
            description: '',
            messages: [],
            passCode: passCode,
            safeCode: safeCode,
        });
        return res.status(200).json({
            id: userRecord.uid,
            name: nickname,
            URL: '',
            description: '',
            docId: docRef.id,
            passCode: passCode,
            safeCode: safeCode,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});

/* Update user */
router.put('/', async (req, res) => {
    try {
        const userRecord = await admin.auth().getUser(req.body.userId);
        const docRef = db.collection(userCollection).doc(req.body.docId);
        const data = {};
        if (req.body.name) {
            data.name = req.body.name;
        }
        if (req.body.url) {
            data.URL = req.body.url;
        }
        if (req.body.description) {
            data.description = req.body.description;
        }
        if (req.body.passCode) {
            data.passCode = req.body.passCode;
        }
        if (req.body.safeCode) {
            data.safeCode = req.body.safeCode;
        }
        const response = await docRef.update(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/* Update user's messages */
router.put('/messages', async (req, res) => {
    try {
        const docRef = db.collection(userCollection).doc(req.body.docId);
        const response = await docRef.update({
            messages: req.body.messages,
        });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/* Get user's messages */
router.get('/messages', async (req, res) => {
    try {
        let messages = [];
        db.collection(userCollection).doc(req.query.docId).get()
            .then((doc) => {
                doc.data().messages.map((item) => {
                    messages.push({
                        notificationId: item.notificationId,
                        number: item.number,
                    });
                });
            });
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).send(error);
    }
});

/* Upload user's avatar */
router.post('/avatar', async (req, res) => {
    try {
        if (req.files === null) {
            throw new Error('No file uploaded');
        }
        const file = req.files.file;
        const uuid = uuidv4();
        const bucket = await admin.storage().bucket().upload(file.name, {
            gzip: true,
            metadata: {
                cacheControl: 'public, max-age=31536000',
                firebaseStorageDownloadTokens: uuid,
            },
        });
        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${'testing-chat-10f25.appspot.com'}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
        fs.unlinkSync(`./${file.name}`);
        return res.status(200).json({downloadURL: downloadURL});
    } catch (error) {
        return res.status(500).json({msg: 'Server error'});
    }
});

/* Auth for user*/
router.post('/auth', async (req, res) => {
    const {body} = req;
    if (!validator.validate(body.email)) {
        return res.status(500).send({
            "code": "auth/invalid-email",
            "message": "The email address is badly formatted."
        });
    }
    if (body.password.length === 0) {
        return res.status(500).send({
            "code": "auth/wrong-password",
            "message": "The password is invalid or the user does not have a password."
        });
    }
    try {
        const result = await firebase.auth().signInWithEmailAndPassword(body.email, body.password);
        const user = await admin.firestore().collection('users')
            .where('id', '==', result.user.uid)
            .get()
            .then((result) => {
                const response = [];
                result.forEach((doc) => {
                    response.push({...doc.data(), docId: doc.id});
                });
                return response;
            });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;