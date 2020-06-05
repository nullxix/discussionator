const express = require('express')
const router = express.Router()
const roomManager = require('../room-manager')


router.use('*', (req, res, next) => {
    next()
})

router.get('/lobby-games', (req, res, next) => {
    roomManager.getLobbyGames()
    .then(games => {
        res.send(games)
    })
    .catch(err => console.log(err))
})

router.post('/game', (req, res, next) => {
    console.log('new game')
    console.log(req.body)
    roomManager.newMatch(req.body)
    .then(room => {
        room.playerIsHost = true
        res.cookie('room-data', JSON.stringify(room), {maxAge: (1000*60*3)})
        res.send({host: true, room, goto: "../room-static", success: true})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/peer-id', (req, res, next) => {
    roomManager.getNewPeerId()
    .then(peerId => {
        res.send(peerId)
    })
})

router.put('/join-room', (req, res, next) => {
    roomManager.joinRoom(req.query.id, req.query.role)
    .then(data => {
        console.log('--api.js')
        console.log(data.room)
        const {room, player} = data
        room.playerIsHost = false
        res.cookie('player-data', JSON.stringify(player), {maxAge: (1000*60*3)})
        res.cookie('room-data', JSON.stringify(room), {maxAge: (1000*60*3)})
        res.send({host: false, room, goto: "../room-static", msg: "You would like to join room: " + req.query.id})
    })
})

module.exports = router