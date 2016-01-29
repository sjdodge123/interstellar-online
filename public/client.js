var maxObjects = 20000,
	movement;

function clientConnect() {
	"use strict";
		var socket = io();
		setMaxObjects();
   		socket.on('spawnMyShip', function(packet){
			myShip = new ShipObject(400,500,10,30,0,'white',20);
			myShip.weapon = new Cannon(400,500,5,15,0,'red');
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
					ship.weapon.ID = ship.weaponID;
					console.log('Storing ship at : ' + ship.ID);
					gameObjectList[ship.ID] = ship;
					console.log('Storing weapon at : ' + ship.weapon.ID);
					gameObjectList[ship.weapon.ID] = ship.weapon;
  				}
	  		}

	  		for(var i = 0; i < gameObjectList.length;i+=1){
				if(gameObjectList[i] != null) {
					count+=1;
				}	
			}
			
	  		console.log(count);
	  	});

	  	socket.on('player has left', function(index){
			gameObjectList[index] = null;
	  	});
	  	return socket;
}

function sendMoveUpdates(evt){
	socket.emit('movement',myShip);
}

function setMaxObjects(){
	for(var i=0; i<maxObjects;i+=1){
		gameObjectList.push(null);
	}
}
