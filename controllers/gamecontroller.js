let router = require('express').Router();
let Game = require('../db').import('../models/game');
let validateSession = require('../middleware/validate-session');

router.get('/all', validateSession, (req, res) => {
    Game.findAll({ where: { owner_id: req.user.id } })
        .then(
            function findSuccess(data) {
                res.status(200).json({
                    games: data,
                    message: "Data fetched."
                })
            },

            function findFail() {
                res.status(500).json({
                    message: "Data not found"
                })
            }
        )
})

router.get('/:id', (req, res) => {
    Game.findOne({ where: { id: req.params.id, owner_id: req.user.id } })
        .then(
            function findSuccess(game) {
                res.status(200).json({
                    game: game
                })
            },

            function findFail(err) {
                res.status(500).json({
                    message: "Data not found."
                })
            }
        )
})

//CREATE GAME ENTRY
router.post('/create', validateSession, (req, res) => {
    const gameEntry = {
        title: req.body.game.title,
        //owner_id: req.body.user.id,
        owner_id: req.user.id,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    };

    Game.create(gameEntry)
    .then((game) => res.status(200).json(game, {message: "game created"}))
    .catch((err) => res.status(500).json({error: err}));
})

//UPDATE GAME ENTRY
router.put('/update/:id', validateSession, (req, res) => {
    const updateGameEntry = {
        title: req.body.game.title,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    };
    
    const query = { where: {id: req.params.id, owner_id: req.user }};
    
    Game.update(updateGameEntry, query)
        .then((games) => res.status(200).json({message: 'Game entry updated'}))
        .catch((err) => res.status(500).json({error:err}));
});

//DELETE GAME ENTRY
router.delete('/remove/:id', (req, res) => {
    Game.destroy({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })
    .then(()=> res.status(200).json({message: 'Game removed from database.'}))
    .catch((err) => res.status(500).json({error: err}));
});

module.exports = router;