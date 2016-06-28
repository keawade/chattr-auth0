var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.set('view engine', 'pug')
app.set('port', process.env.PORT || 3000)
app.set('ip', process.env.IP || 'localhost')

app.use(express.static('public'))
app.locals.sitename = 'chattr-auth0'
app.locals.source_url = 'https://github.com/keawade/chattr-auth0'

app.get('/', function (req, res) {
    res.render('chat')
})

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});

http.listen(3000, function () {
    console.log('[server] listening at port 3000')
})
