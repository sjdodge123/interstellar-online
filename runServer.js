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
var debugEnabled = true;
var maxObjects = 20000
"use strict";

var debug = {
	log : function(string){
		if(debugEnabled){
			console.log(string);
		}
	}
}

console.log("Server Starting..");

process.on( 'SIGINT', function() {
	  console.log( "\nServer shutting down from (Ctrl-C)" );

	  for(var socket in io.sockets.sockets){
	  	io.sockets.sockets[socket].emit("serverShutdown","Server terminated");
	  }
	  process.exit();
});

io.on('connection', function(socket){
	client[socket.id] = {clientID:clientID};
	debug.log('User '+ client[socket.id].clientID + ' has joined. From ' + socket.handshake.address);


	var newShip = createNewShip(socket);

	client[socket.id].shipID = newShip.ID;
	client[socket.id].weaponID = newShip.weapon.ID;
	debug.log('New ship ID : '+client[socket.id].shipID);
	debug.log('New weapon ID : '+client[socket.id].weaponID);

	var sendArray = [];
	debug.log('Preparing to send game board state to User '+ client[socket.id].clientID);
	for(var i=0;i<gameObjectList.length;i+=1) {
		if(gameObjectList[i]!=null&& gameObjectList[i].type !='Cannon') {
			if(gameObjectList[i].type =='ShipObject'){
				debug.log('Sending ' + gameObjectList[i].type + ' located at '+ i + ' - ID: ' +gameObjectList[i].ID+ ' WID: '+gameObjectList[i].weaponID);
				sendArray.push({type:gameObjectList[i].type,ID:gameObjectList[i].ID,weaponID:gameObjectList[i].weaponID});
			}
				
		}
	}


	debug.log('Sent '+ sendArray.length + ' items to User ' +client[socket.id].clientID+'\n');

	socket.emit('spawnBoardObjects',sendArray);


	socket.emit('spawnMyShip',{shipIndex:newShip.ID,weaponIndex:newShip.weaponID});
	socket.broadcast.emit('newShipArrvied',{shipIndex:newShip.ID,weaponIndex:newShip.weaponID});
	clientID += 1;

	socket.on('movement', function(ship){
		gameObjectList[ship.ID].x = ship.x;
		gameObjectList[ship.ID].y = ship.y;
		gameObjectList[ship.ID].angle = ship.angle;
		gameObjectList[ship.ID].weapon.angle = ship.weapon.angle;
		socket.broadcast.emit('movement',{
			index:ship.ID,
			x:ship.x,
			y:ship.y,
			angle:ship.angle,
			weaponID:ship.weapon.ID,
			weaponAngle:ship.weapon.angle
		});
	});

	socket.on('shotFired',function(shipID){
		var newBullet = createNewBullet(shipID);
		debug.log("bulletFired stored at: " + newBullet.ID);
		socket.emit('bulletFired',newBullet);
		socket.broadcast.emit('bulletFired',newBullet);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('player has left',client[socket.id].shipID);
		gameObjectList[client[socket.id].shipID] = null;
		debug.log('Cleaning up object at storage location '+client[socket.id].shipID);
		gameObjectList[client[socket.id].weaponID] = null;
		debug.log('Cleaning up object at storage location '+client[socket.id].weaponID);
		debug.log('User '+ client[socket.id].clientID + ' disconnected.');
  	});
});


function createNewBullet(shipID){
	var ship = gameObjectList[shipID];
	var nextBullet = new objects.createBulletObject(ship.x,ship.y,ship.weapon.angle,ship.velx + 1,ship.vely + 1,ship.weapon.ID);
	debug.log("Ships current angle" + ship.angle);
	nextBullet.ID = findEmptySlot();
	gameObjectList[nextBullet.ID] = nextBullet;
	return nextBullet;
}

function createNewShip(socket){
	var nextShip = new objects.createShipObject;
	nextShip.ID =  findEmptySlot();
	gameObjectList[nextShip.ID] = nextShip;

	debug.log('Storing User '+client[socket.id].clientID+"'s ship at "+nextShip.ID);

	nextShip.weapon = new objects.createCannonObject;
	nextShip.weapon.ID = findEmptySlot();
	nextShip.weaponID = nextShip.weapon.ID;

	gameObjectList[nextShip.weaponID] = nextShip.weapon;
	debug.log('Storing User '+client[socket.id].clientID+"'s weapon at "+gameObjectList[nextShip.ID].weaponID);

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

function sendMovements(){

}



server.listen(3000, function(){
	setMaxPlayers();
	console.log('listening on *:3000');
});







