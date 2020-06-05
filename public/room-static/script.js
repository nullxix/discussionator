const camModal = document.getElementById('camera-modal')
const enableCamBtn = document.getElementById('enable-camera')
const topicDisplay = document.getElementById('topic-display')
const remoteCameraBox = document.getElementById('remote-camera-box')

let stream = undefined
let peer = undefined
let playerData = undefined
let remoteVideo = undefined
let localVideo = undefined

const flags = {
    remoteCameraDisplayed: false,
    localCameraDisplayed: false,
}


const roomData = readAndParseCookie("room-data")

initRoom()


function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function readAndParseCookie(name){
    let _cook = readCookie(name)
    let _d_cook = decodeURI(_cook)
    let _SUPER_d_cook = _d_cook.replace(/%3A/g, ":").replace(/%2C/g, ",")
    return JSON.parse(_SUPER_d_cook)
}


enableCamBtn.addEventListener('click', event => {
    
    navigator.getUserMedia({video: true, audio: true}, (_stream) => {
        hideModal()
        stream = _stream
        if(!roomData.playerIsHost){
            //we are the guest
            //so we go challenge the host
            connectToHost()
        }
    }, (err) => {
        alert('Failed to enable voice & video', err);
        console.log('Failed to enable voice & video', err)
    });
})


function hideModal(){
    camModal.style.display = 'none';
}

function initRoom(){
    topicDisplay.innerText = roomData.topic
    if(roomData.playerIsHost){
        hostInit()
    } else {
        playerInit()
    }
}


function hostInit(){
    //first, connect the peer
    console.log('init host:')
    let peerId = roomData.players[0].peerId
    connectToPeerServer(peerId, true)
}

function playerInit(){
    console.log('init player:')
    playerData = readAndParseCookie('player-data')
    let peerId = playerData.peerId
    connectToPeerServer(peerId)
}


function connectToPeerServer(id, host = false){

    peer = new Peer(id, {key: 'peerjs', port:9001, host: '192.168.1.167', path:'/peer-server'});
    peer.on("connection", connection => {
        console.log("connection received")
        console.log(connection)
        console.log('--end connection--')
        if(host){
            console.log(connection)
        }
    })
    peer.on("call", call => {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (remoteStream) => {
            handleCall(remoteStream)
        });
    }, (err) => {
        console.error('Failed to get local stream', err);
    });

    if(!roomData.playerIsHost){
        // wait for camera to be initialized (handled elsewhere in the code)
        // then tell them where to connect
    } else {
        // accept a connection from challengers
        peer.on("connection", conn => {
            conn.on('open', () => {
                conn.on('data', _data => {
                    let data = undefined
                    try {
                        data = JSON.parse(_data)
                        if(data.connectTo)
                        //now that we know who you are, 
                        //let's see your face
                        callChallenjour(data.connectTo)
                    } catch (err) {
                        console.log(err)
                        alert(err)
                    }
                })
            })
        })
    }
}

function connectToHost(){
    const destId = roomData.players[0].peerId
    console.log("attempting to connect:", destId)
    console.log(roomData)
    const conn = peer.connect(destId)
    conn.on('open', function() {
        console.log('--conection success!')
        // Receive messages
        conn.on('data', function(data) {
            console.log('Received', data);
        });
        
        //tell host who to connect to
        if(playerData){
            const package = JSON.stringify({
                connectTo: playerData.peerId
            })
            conn.send(package);
        } else {
            alert('Connection error: cookies might be disabled')
        }

    });
}

function callChallenjour(peerId){
    const call =peer.call(peerId, stream)
    call.on('stream', remoteStream => {
        handleCall(remoteStream)
    })
}


function handleCall(remoteStream){
    displayVideo(remoteStream)
}

function displayVideo(remoteStream, local=false){
    videoEle = local ? localVideo : remoteVideo
    if(videoEle){
        videoEle.srcObject = remoteStream
    } else {
        videoEle = document.createElement('video')
        const video = document.createElement('video');
        if ('srcObject' in video) {
            console.log("attaching mediastream to srcObject")
            video.srcObject = remoteStream;
        } else {
            // Avoid using this in new browsers, as it is going away.
            video.src = URL.createObjectURL(remoteStream);
        }
        //attach the video to the document
        videoEle.width = 500
        videoEle.height = 500
        videoEle.autoplay = true
        videoEle.play()
        if(local){
            localVideo = videoEle
        } else {
            remoteVideo = videoEle
            remoteCameraBox.style.display = 'block'
            remoteCameraBox.appendChild(remoteVideo)
        }
        
    }
   
}