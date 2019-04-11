const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');


const app = express();


//  Todos podem consumir e usar a aplicação
app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

//  Room pra cada box
io.on("connection", socket => {
    socket.on("connectRoom", box => {
        socket.join(box);
    })
});

//  MONGODB
mongoose.connect(
    'mongodb+srv://omnistack:omnistack@cluster0-a6vdl.mongodb.net/omnistack?retryWrites=true', 
    {
        useNewUrlParser: true
    });

app.use((req, res, next) => {
    req.io = io;

    //  Processa Middleware e passar adiante
    return next();
})
    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

server.listen(process.env.PORT || 3333);
