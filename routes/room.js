const express = require('express')
const router = express.Router()




router.use('*', (req, res, next) => {
    console.log('someone found a room')
    next()
})




router.get('*/:id', (req, res, next) => {
    console.log('entering room', req.params)
    res.send('You are in room: ' + req.params.id)
})

router.use('*', (req, res, next) => {
    res.send('empty room')
})



module.exports = router