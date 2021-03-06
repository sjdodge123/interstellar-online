var maxObjects = 20000,
	serverRunning = false,
	serverShutdownReason = "",
	movement;

function clientConnect() {
	"use strict";
		var socket = io();
		setMaxObjects();
   		socket.on('spawnMyShip', function(packet){
   			serverRunning = true;
			myShip = new ShipObject(400,500,10,30,0,'white',20);
			myShip.weapon = new Cannon(400,500,5,15,0,'red');
			myShip.weaponID = packet.weaponIndex;
			myShip.weapon.ID = myShip.weaponID;
			myShip.ID = packet.shipIndex;
			gameObjectList[packet.shipIndex] = myShip;
			gameObjectList[packet.weaponIndex] = myShip.weapon;
			movement = setInterval(sendMoveUpdates,10);
    	});

	    socket.on('newShipArrvied', function(packet){
			var ship = new ShipObject(400,500,10,30,0,'white',20);
			ship.weapon = new Cannon(400,500,5,15,0,'red');
			ship.ID = packet.shipIndex;
			gameObjectList[packet.shipIndex] = ship;
			gameObjectList[packet.weaponIndex] = ship.weapon;
	    });
    
	    socket.on('movement', function(packet){
	    	if(gameObjectList[packet.index]){
	    		gameObjectList[packet.index].x = packet.x;
				gameObjectList[packet.index].y = packet.y;
				gameObjectList[packet.index].angle = packet.angle;
				gameObjectList[packet.weaponID].angle = packet.weaponAngle;
	    	}
	  	});

	  	socket.on('spawnBoardObjects', function(objectList) {
	  		var count = 0;
	  		for(var i=0; i < objectList.length;i+=1){
	  			var type = objectList[i].type;
  				if(type == 'ShipObject') {
  					console.log('Found ship object');
  					var ship = new ShipObject(400,500,10,30,0,'white',20);
  					ship.weapon = new Cannon(400,500,5,15,0,'red');
					ship.ID = objectList[i].ID;
					ship.weaponID = objectList[i].weaponID;

					ship.weapon.ID = objectList[i].weaponID;
					console.log('Storing ship at : ' + ship.ID);
					gameObjectList[ship.ID] = ship;
					console.log('Storing weapon at : ' + ship.weapon.ID);
					gameObjectList[ship.weapon.ID] = ship.weapon;
					console.log('setting weapon ID to '+ship.weapon.ID)
  				}
	  		}

	  		for(var i = 0; i < gameObjectList.length;i+=1){
				if(gameObjectList[i] != null) {
					count+=1;
				}	
			}
	  	});

	  	socket.on('bulletFired', function(bullet){
	  		console.log('New shot fired at ID: ' + bullet.ID);
	  		gameObjectList[bullet.ID] = new Bullet(bullet.x,bullet.y,bullet.width,bullet.height,bullet.angle,bullet.color,bullet.velx,bullet.vely,bullet.ownerID);
	  		//gameObjectList[bullet.ownerID].fire(dirX,dirY);
	  	});

	  	socket.on('serverShutdown', function(reason){
	    	serverRunning = false;
	    	serverShutdownReason = reason;
	    	socket.disconnect();
	  	});

	  	socket.on('player has left', function(index){
			gameObjectList[index] = null;
	  	});

	  	return socket;
}

function sendMoveUpdates(evt){
	socket.emit('movement',myShip);
}

function fireShot(){
	socket.emit('shotFired',myShip.ID);
}

function setMaxObjects(){
	for(var i=0; i<maxObjects;i+=1){
		gameObjectList.push(null);
	}
}
