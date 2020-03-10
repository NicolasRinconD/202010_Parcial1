let socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

const Mongolib = require("./db/Mongolib");

socketApi.io = io;

io.on('connection', function (socket) {
    console.log("user connected");
    socketApi.sendNotification();

    socket.on('disconnect', function(){
        console.log('user disconnected');
      });

    socket.on('new-registro', reg =>{
        socket.emit('new-registro', reg);
    });
    
    socket.on('new-message', data =>{
        socket.emit('new-message', data);
    });

    socket.on('new-oferta', data =>{
        Mongolib.getDatabase(db =>{
            Mongolib.insertOferta(db, data, ()=>{socketApi.sendNotification()})
            if(data.aceptada){
                io.sockets.emit('oferta-aceptada', {});
            }
            else{
                io.sockets.emit('oferta-declined', {});
            }
        })
    });
    socket.on('pre-oferta', data=>{
        Mongolib.getDatabase(db =>{
            Mongolib.findOfertas(db, docs =>{
                socket.emit('crear-oferta', docs);
            });
        });
    });

    socket.on('reset', data=>{
        Mongolib.getDatabase(db =>{
            Mongolib.deleteOfertas(db, ()=>{socketApi.sendNotification()});
        })
    });
});

socketApi.sendNotification = () => {
    Mongolib.getDatabase(db => {
        Mongolib.findOfertas(db, docs => {
            io.sockets.emit('ofertas', docs);
            console.log(docs);
        });
    })
}

module.exports = socketApi;
