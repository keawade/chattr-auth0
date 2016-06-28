var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var socketioJwt = require('socketio-jwt')
var dotenv = require('dotenv')

dotenv.load()

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
};
var port = process.env.PORT || 3000

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

app.use(express.static(__dirname + '/public'))
app.locals.sitename = 'chattr-auth0'
app.locals.source_url = 'https://github.com/keawade/chattr-auth0'

io
    .on('connection', socketioJwt.authorize({
        secret: Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
        timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', function (socket) {
        console.log('[auth] socket authenticated', JSON.stringify(socket.decoded_token))
            socket.on('chat message', function (msg) {
                io.emit('chat message', msg);
            });
    })

app.get('/', function (req, res) {
  res.render('chat', { env: env })
})

http.listen(port, function(){
  console.log('listening on *:' + port)
})
