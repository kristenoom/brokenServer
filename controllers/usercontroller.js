let router = require('express').Router();
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let User = require('../db').import('../models/user');

router.post('/signup', (req, res) => {
    User.create({
        full_name: req.body.user.full_name,
        username: req.body.user.username,
        passwordHash: bcrypt.hashSync(/*req.body.user.passwordHash, 10*/),
        email: req.body.user.email,
    })
        .then(
            function signupSuccess(user) {
                let token = jwt.sign(
                    { id: user.id }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: 60 * 60 * 24 });
                res.status(200).json({
                    user: user,
                    message: 'user successfully created',
                    sessionToken: token
                })
            },

            function signupFail(err) {
                res.status(500).send(err.message)
            })
        .catch((err) => res.status(500).json({error:err}));
})

router.post('/signin', (req, res) => {
    User.findOne({ where: { username: req.body.user.username } })
    .then(user => {
        if (user) {
            bcrypt.compare(
                req.body.user.password, 
                 user.passwordHash,
                //user.password, 
                function (err, matches) {
                    if (matches) {
                        var token = jwt.sign({ id: user.id }, 
                            "lets_play_sum_games_man",
                             { expiresIn: 60 * 60 * 24 });
                        res.status(200).json({
                            user: user,
                            message: "Successfully authenticated.",
                            sessionToken: token
                        });
                    } else {
                        res.status(502).send({ error: "Passwords do not match." })
                    }
                });
        } else {
            res.status(403).send({ error: "User not found." })
        }

    })
    .catch((err) => res.status(500).json({error: err}));
})

module.exports = router;