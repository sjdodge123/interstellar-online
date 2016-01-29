function updatePhysics(object) {
	updateVelocity(object);
	updatePosition(object);
	updateRotation(object);
	return object;
}

function updatePosition(object) {
	object.x += object.velX;
	object.y += object.velY;
	
}

function updateVelocity(object) {
	object.velX = object.accelX;
	object.velY = object.accelY;
}

function updateRotation(object) {

}

function findVelocity(){
	return {velX:20,velY:1};
}