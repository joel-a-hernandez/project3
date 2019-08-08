const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;

// Added by jyoti for scoket connection 
var server = require('http').Server(app);
var io = require('socket.io')(server);
//Added by jyoti

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/trivia_masters");

// Start the API server
server.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
}); 

//SOCKET AND GAME STATES START HERE
// =====================================================================

// let clients = 0;
//Users will keep track of all socket users, their status and their name (?)
// let allSocketUsers = [];
var allSocketUsers =  {
  totalUserCount = 0,
  userList = []
};

//Sessions will hold all the needed game information for the server
//Player 1
//Player 2
//isOpen true/false
//
var gameCollection = {
  totalGameCount = 0,
  gameList = []
};

io.on('connection', function (player) {
  var addedUser = false;
  // io.emit('broadcast', { description: allSocketUsers.totalUserCount + ' clients connected!' });

  //Emit to users/new User when someone new is Connected
  socket.emit('newclientconnect', { description: 'Hey, welcome!' });
  socket.emit('userConnected', { socketId: socket.id });
  io.broadcast.emit('newclientconnect', { description: allSocketUsers.totalUserCount + ' clients connected!' });

  let newUser = {};
  newUser.id = socket.id;
  newUser.status = "Idle";
  allSocketUsers.totalUserCount++;
  allSocketUsers.userList.push(newUser);

  //Let server-side know someone's connected
  console.log('==================================================================');
  console.log('A user connected!', socket.id);
  console.log("ALL SOCKET USERS INFO :" + JSON.stringify(allSocketUsers.userList));
  console.log("CLIENTS # = " + allSocketUsers.totalUserCount);

  //Click Handler
  socket.on('clicked', function (data) {
    console.log(data);
    io.sockets.emit('clicked', { data: socket.id });
  });

  socket.on('player-matchmaking', gameData => {
    io.emit('player-matchmaking', gameData)
  });

  socket.on('player-select', gameData => {
    io.emit('player-select', gameData)
  });

  socket.on('player-ready', gameData => {
    io.emit('player-ready', gameData)
  });

  socket.on('player-endGame', gameData => {
    io.emit('player-endGame', gameData)
  });

  socket.on('disconnect', data => {
    console.log("USER DISCONNECTED" + data);
    io.emit('disconnect', data);

    });
});

function buildGame(socket) {
    var gameObject = {};
    //generate random Object ID for reference later
    gameObject.id = (Math.random()+1).toString(36).slice(2, 18);
    // gameObject.playerOne = socket.name;
    // gameObject.playerTwo = null;
    gameCollection.totalGameCount ++;
    gameCollection.gameList.push({gameObject});
  
    console.log("Game Created by "+ socket.name + " w/ " + gameObject.id);
    io.emit('gameCreated', {
    name: socket.name,
    gameId: gameObject.id
  });
 }