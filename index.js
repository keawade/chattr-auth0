var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var socketioJwt = require('socketio-jwt')
require('dotenv').config()

app.set('view engine', 'pug')
app.set('port', process.env.PORT || 3000)
app.set('ip', process.env.IP || 'localhost')

app.use(express.static('public'))
app.locals.sitename = 'chattr-auth0'
app.locals.source_url = 'https://github.com/keawade/chattr-auth0'

app.get('/', function (req, res) {
    res.render('chat')
})

io
    .on('connection', socketioJwt.authorize({
        secret: Buffer(process.env.AUTH0_SECRET, 'base64'),
        timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', function (socket) {
        console.log('[auth] socket authenticated', JSON.stringify(socket.decoded_token))
            socket.on('chat message', function (msg) {
                io.emit('chat message', msg);
            });
    })

http.listen(3000, function () {
    console.log('[server] listening at port 3000')
})
