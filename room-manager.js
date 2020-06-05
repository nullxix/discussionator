const _UUID = require('uuid')
const uuid = _UUID.v1


const rooms = []
const players = []
const peerIds = []

module.exports = {
    getLobbyGames,
    newMatch,
    getNewPeerId,
    joinRoom,
}



function getLobbyGames(){
    return new Promise((ful, rej) => {
        ful(rooms)
    })
}

function getNewPeerId(){
    return new Promise((ful , rej) => {
        const _peerId = uuid()
        peerIds.push(_peerId)
        ful(_peerId)
    })
}

function createRoom(topic, player){
    return new Promise((ful, rej) => {
        room = {
            topic,
            id: uuid(),
            players: [
                player
            ]
        }
        rooms.push(room)
        ful(room)
    })
}

function createPlayer(options){
    const {name, role} = options
    return getNewPeerId()
    .then(peerId => {
        const player = {
            id: uuid(),
            peerId,
            name, 
            role
        }
        players.push(player)
        return(player)
    })
}


function newMatch(options){
    const {topic, player} = options
    return createPlayer(player)
    .then(play => {
        return createRoom(topic, play)
    })
}

function joinRoom(id, role){

    let room;
    return createPlayer({name: 'anonymous', role})
    .then(player => {
        for (let i = 0; i < rooms.length; i++){
            if(rooms[i].id === id)
                room = rooms[i]
        }
        console.log('--rm join')
        console.log(room.players)
        return {room, player}
    })
}



