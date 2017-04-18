"use strict";
var exports;
class GameObject {
	constructor (x,y,width,height,angle,color) {
		this.width = width;
		this.height = height;
		this.angle = angle;
		this.color = color;
		this.x = x;
		this.y = y;
		this.type = 'GameObject';
		this.speed = 0;
		this.velX = 0;
		this.velY = 0;
		this.accelX=0;
		this.accelY=0;
		this.ID = null;
		this.draw = function(){
			ctx.save();
			ctx.translate(this.x+this.width/2,this.y+this.height/2);
			ctx.rotate(this.angle*Math.PI/180);
			ctx.fillStyle = 'red';
			ctx.fillRect(-this.width/2-camera.x,-this.height/2-camera.y,this.width,this.height);
			ctx.restore();
		};
		this.update = function(){
			updatePhysics(this);
			this.draw();
		};
	}
}
class ShipObject extends GameObject {
	constructor(x,y,width,height,angle,color,turnSpeed){
		super(x,y,width,height,angle,color);
		this.speed = 1;
		this.turnSpeed = 5;
		this.dirX=0;
		this.dirY=0;
		this.weapon = null;
		this.weaponID = null;
		this.type = 'ShipObject';
		this.draw = function() {
			ctx.save();
			ctx.translate(this.x+this.width/2,this.y+this.height/2);
			ctx.rotate(this.angle*Math.PI/180);
			ctx.fillStyle = this.color;
			ctx.fillRect(-this.width/2-camera.x,-this.height/2-camera.y,this.width,this.height);
			ctx.fillStyle = 'black';
			ctx.fillRect(-this.width/2-camera.x,-this.height/2 - .2 -2-camera.y,this.width/4,this.height/4);
			ctx.fillRect(-this.width/2+this.width-2-camera.x,-this.height/2 - .2-camera.y,this.width/4,this.height/4);
			ctx.fillRect(-this.width/8-this.width/8-camera.x,-this.height/2 + this.height-this.height/4-camera.y,this.width/2,this.height/4);
			ctx.restore();
			if(this.weapon !=  null){
				this.weapon.draw(this.x+this.width/4-camera.x,this.y+this.height/4-camera.y);	
			}
		};
	}
}

class Asteroid extends GameObject {
	constructor(x,y,width,height,angle,color){
		super(x,y,width,height,angle,color);
		this.drawCords = null;
		this.vertices = 6 + Math.floor(Math.random() * 6);
		this.inner = 4 + Math.floor(Math.random() * 30);
		this.outer = this.inner + Math.floor(Math.random() * this.inner);
		this.rotateSpeed = -.05 + Math.random() * .1;
		this.type = 'Asteroid';
		this.draw();
		this.draw = function(){
			this.drawCords = drawPoly(this.vertices,this.outer,this.inner,this.x,this.y,"cyan");
			this.drawCords.rotateSpeed = this.rotateSpeed;
		};
		this.update = function(){
			this.drawCords = updatePoly(this.drawCords);
		};
	}
}

class Cannon extends GameObject{
	constructor(x,y,width,height,angle,color){
		super(x,y,width,height,angle,color);
		this.bulletList = [];
		this.type = 'Cannon';
		this.update = function () {
			this.angle = (180/Math.PI)*Math.atan2(mouseY-myShip.y,mouseX-myShip.x)-90;
		};
		this.fire = function(x,y){
			var v = findVelocity(); //Stored in physics module, needs to actually return {velx vely}
			var bullet = new Bullet(x,y,3,10,this.angle,"red",v.velX,v.velY);
			gameObjectList.push(bullet);
		};
		this.draw = function(x,y){
			ctx.save();
			ctx.translate(x+this.width/2,y+this.height/2);
			ctx.rotate(this.angle*Math.PI/180);
			ctx.fillStyle = this.color;
			ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
			ctx.restore();
		};
	}
}
class Bullet extends GameObject{
	constructor(x,y,width,height,angle,color,velX,velY){
		super(x,y,width,height,angle,color);
		this.velX = velX;
		this.velY = velY;
		this.type = 'Bullet';
		this.draw = function (){
			ctx.save();
			ctx.translate(this.x+this.width/2,this.y+this.height/2);
			ctx.rotate(this.angle*Math.PI/180);
			ctx.fillStyle = this.color;
			ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
			ctx.restore();
		};
	}
}
if(exports) {
	exports.createShipObject = (function() {
		return new ShipObject(400,500,10,30,0,'white',20);
	});

	exports.createCannonObject = (function () {
		return new Cannon(400,500,5,15,0,'red');
	});
}
