var express = require('express')
  , http = require('http');
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var objects =  require("./public/spaceObjects.js");

var clientID = 0;
var client = {};
var gameObjectList = [];
var maxObjects = 20000
"use strict";
io.on('connection', function(socket){
	client[socket.id] = {clientID:clientID};
	console.log('User '+ client[socket.id].clientID + ' has joined.');


	var newShip = createNewShip(socket);

	client[socket.id].shipID = newShip.ID;
	client[socket.id].weaponID = newShip.weapon.ID;
	console.log('New ship ID : '+client[socket.id].shipID);
	console.log('New weapon ID : '+client[socket.id].weaponID);

	var sendArray = [];
	console.log('Preparing to send game board state to User '+ client[socket.id].clientID);
	for(var i=0;i<gameObjectList.length;i+=1) {
		if(gameObjectList[i]!=null&& gameObjectList[i].type !='Cannon') {
			if(gameObjectList[i].type =='ShipObject'){
				console.log('Sending ' + gameObjectList[i].type + ' located at '+ i + ' - ID: ' +gameObjectList[i].ID+ ' WID: '+gameObjectList[i].weaponID);
				sendArray.push({type:gameObjectList[i].type,ID:gameObjectList[i].ID,weaponID:gameObjectList[i].weaponID});
			}
				
		}
	}


	console.log('Sent '+ sendArray.length + ' items to User ' +client[socket.id].clientID+'\n');

	socket.emit('spawnBoardObjects',sendArray);


	socket.emit('spawnMyShip',{shipIndex:newShip.ID,weaponIndex:newShip.weaponID});
	socket.broadcast.emit('newShipArrvied',{shipIndex:newShip.ID,weaponIndex:newShip.weaponID});
	clientID += 1;

	socket.on('movement', function(ship){
		gameObjectList[ship.ID].x = ship.x;
		gameObjectList[ship.ID].y = ship.y;
		socket.broadcast.emit('movement',{index:ship.ID, x:ship.x,y:ship.y,angle:ship.angle});
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('player has left',client[socket.id].shipID);
		gameObjectList[client[socket.id].shipID] = null;
		console.log('Cleaning up object at storage location '+client[socket.id].shipID);
		gameObjectList[client[socket.id].weaponID] = null;
		console.log('Cleaning up object at storage location '+client[socket.id].weaponID);
		console.log('User '+ client[socket.id].clientID + ' disconnected.');
  	});
	
});

function createNewShip(socket){
	var nextShip = new objects.createShipObject;
	nextShip.ID =  findEmptySlot();
	gameObjectList[nextShip.ID] = nextShip;

	console.log('Storing User '+client[socket.id].clientID+"'s ship at "+nextShip.ID);

	nextShip.weapon = new objects.createCannonObject;
	nextShip.weapon.ID = findEmptySlot();
	nextShip.weaponID = nextShip.weapon.ID;

	gameObjectList[nextShip.weaponID] = nextShip.weapon;
	console.log('Storing User '+client[socket.id].clientID+"'s weapon at "+gameObjectList[nextShip.ID].weaponID);

	return nextShip;
}

function setMaxPlayers(){
	for(var i=0; i<maxObjects;i+=1){
		gameObjectList.push(null);
	}
}

function findEmptySlot(){
	for(var i=0;i<gameObjectList.length;i+=1){
		if(gameObjectList[i] == null) {
			return i;
		}
	}
}

server.listen(3000, function(){
	setMaxPlayers();
	console.log('listening on *:3000');
});
