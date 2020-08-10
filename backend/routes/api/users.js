const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../../config/jwtSecretKey');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const User = require('../../controllers/userController');
const sendEmail = require('./../../controllers/email/send');
const msgs = require('./../../controllers/email/msgs');
const templates = require('./../../controllers/email/templates');

router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then(user => {
            //sending confirmation
            if (!user) {
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        }

                        newUser.password = hash;
                        newUser
                            .save()
                            .then(newUser => sendEmail(newUser.email, templates.confirm(newUser._id)))
                            .then(() => res.json({msg: msgs.confirm}))
                            .catch(err => console.log(err))
                    })
                })
            }
            //we have already seen this email. But it's not confirmed
            else if (user && !user.confirmed) {
                sendEmail(user.email, templates.confirm(user._id))
                    .then(() => res.json({msg: msgs.resend}))
            }
            //email already confirmed
            else {
                res.json({msg: msgs.alreadyConfirmed})
            }
        })
        .catch(err => console.log(err))
});

router.get('/confirm/:id', (req, res) => {
    const {id} = req.params;

    User.findById(id)
        .then(user => {
            // A user with that id does not exist in the DB. Perhaps some tricky
            // user tried to go to a different url than the one provided in the
            // confirmation email.
            if (!user) {
                res.json({msg: msgs.couldNotFind})
            }

            // The user exists but has not been confirmed. We need to confirm this
            // user and let them know their email address has been confirmed.
            else if (user && !user.confirmed) {
                User.findByIdAndUpdate(id, {confirmed: true})
                    .then(() => res.json({msg: msgs.confirmed}))
                    .catch(err => console.log(err))

            }

            // The user has already confirmed this email address.
            else {
                res.json({msg: msgs.alreadyConfirmed})
            }
        })
        .catch(err => console.log(err))
});

router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if (!user) {
                return res.status(404).json({emailNotFound: 'Email not found'});
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            email: user.email
                        };

                        jwt.sign(
                            payload,
                            SECRET_KEY,
                            {
                                expiresIn: 31556926 //1 year
                            },
                            (err, token) => {
                                res.json({
                                    succes: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        )
                    } else {
                        return res
                            .status(400)
                            .json({passwordIncorrect: 'Password incorrect'});
                    }
                })
        })
});

module.exports = router;