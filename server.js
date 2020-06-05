require('dotenv').config()
const   express = require('express'),
        app = express(),
        cookieParser = require('cookie-parser')
        mediaServer = require('./media-server'),
        api = require('./routes/api'),
        roomRoute = require('./routes/room'),
        {PORT} = process.env


/*
        PARSER MIDDLEWARE
*/
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

/*
    ROUTING
*/
app.use('/room', roomRoute)
app.use('/api', api)

/*
    STATIC AND HOME
*/
app.use(express.static('public'))
app.get('/', (req, res, next) => {
    res.redirect('/lobby')
})




/*
    LIGHT HER UP
*/
//mediaServer.run()  //old style of stream forwarding
app.listen(PORT, () => {
    console.log('We be here on port', PORT)
})