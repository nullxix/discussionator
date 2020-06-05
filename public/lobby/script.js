const newDiscussionBtn = document.getElementById('new-discussion')
const newGameForm = document.getElementById('new-game-form')
const newGameBox = document.getElementById('new-game-box')
const refreshLobbyBtn = document.getElementById('refresh-lobby')
const lobbyBox = document.getElementById('lobby-box')

refreshLobbyBtn.addEventListener('click', event => {
    refreshLobby()
})

newDiscussionBtn.addEventListener('click', event => {
    newGameBox.style.display = 'block'
})

newGameForm.addEventListener('submit', event => {
    event.preventDefault()
    const {topic, username, role} = newGameForm.elements
    const package = {
        topic: topic.value,
        player: {
            name: username.value,
            role: role.value
        }
    }

    fetch('/api/game',
    {
        method: 'POST',
        body: JSON.stringify(package),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        window.location = data.goto
    })

})


function refreshLobby(){
    lobbyBox.innerText = "Getting the freshest games ..."
    fetch('/api/lobby-games')
    .then(res => res.json())
    .then(rooms => {
        if(rooms.length <= 0){
            lobbyBox.innerText = 'No discussions here! Find a friend and start a new one'
        } else {
            lobbyBox.innerText=""
            rooms.forEach(r => createLobbyGame(r))
        }
    })
}

function createLobbyGame(room){
    const roomba = document.createElement('div')
    roomba.classList.add('roomba')
    const title = document.createElement('div')
    const btns = document.createElement('div')
    title.innerText = room.topic
    if(room.players.length <= 1){
        if(room.players[0].role === 'for'){
            btns.appendChild(createJoinBtn('against', room))
        } else {
            btns.appendChild(createJoinBtn('for', room))
        }
    } else {
        btns.innerText("2 Angry Men")
    }
    roomba.appendChild(title)
    roomba.appendChild(btns)
    lobbyBox.appendChild(roomba)
}

function createJoinBtn(which, room){
    const btn = document.createElement('button')
    btn.innerText = "join " + which
    btn.addEventListener('click', event => {
        fetch('../api/join-room?id=' + room.id + '&?role=' + which, {
            method: 'PUT'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.msg)
            window.location = data.goto
        })
    })
    return btn
}


// start things off right
refreshLobby()